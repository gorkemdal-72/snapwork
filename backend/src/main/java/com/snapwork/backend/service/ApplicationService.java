package com.snapwork.backend.service;

import com.snapwork.backend.dto.ApplicationDetailsDTO;
import com.snapwork.backend.dto.ApplicationRequest;
import com.snapwork.backend.entity.*;
import com.snapwork.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final WorkerProfileRepository workerRepository;
    private final CustomFieldRepository customFieldRepository;
    private final FieldResponseRepository fieldResponseRepository;

    // NEW: Notification Service Injection
    private final NotificationService notificationService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              WorkerProfileRepository workerRepository,
                              CustomFieldRepository customFieldRepository,
                              FieldResponseRepository fieldResponseRepository,
                              NotificationService notificationService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
        this.customFieldRepository = customFieldRepository;
        this.fieldResponseRepository = fieldResponseRepository;
        this.notificationService = notificationService;
    }

    // 1. CREATE APPLICATION (Apply)
    public void createApplication(ApplicationRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        WorkerProfile worker = workerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Error: You must create a Worker Profile to apply!"));

        if (job.getEmployer().getUser().getUserId().equals(request.getUserId())) {
            throw new RuntimeException("You cannot apply to your own job!");
        }

        Application application = new Application();
        application.setJob(job);
        application.setWorker(worker);
        application.setStatus("PENDING");
        application.setCoverLetter(request.getCoverLetter());

        Application savedApp = applicationRepository.save(application);

        // Save Responses
        if (request.getResponses() != null) {
            for (ApplicationRequest.FieldResponseDTO dto : request.getResponses()) {
                CustomField question = customFieldRepository.findById(dto.getFieldId())
                        .orElseThrow(() -> new RuntimeException("Question not found"));

                FieldResponse response = new FieldResponse();
                response.setApplication(savedApp);
                response.setCustomField(question);
                response.setResponseValue(dto.getResponseValue());
                fieldResponseRepository.save(response);
            }
        }

        // --- NOTIFICATION TRIGGER 1: Notify Employer ---
        String msg = "New Application: " + worker.getUser().getFirstName()+ worker.getUser().getLastName() + " applied for '" + job.getTitle() + "'";
        Long employerUserId = job.getEmployer().getUser().getUserId();
        // Target URL: Where should employer go when clicking? (Applicants Page)
        String url = "/job-applications/" + job.getJobId();

        notificationService.sendNotification(employerUserId, msg, url);
    }

    // 5. UPDATE STATUS (Accept/Reject)
    public void updateApplicationStatus(Long applicationId, String status) {
        if ("ACCEPTED".equalsIgnoreCase(status)) {
            // Call the stored procedure to accept this specific applicant
            applicationRepository.acceptApplication(applicationId);
        } else {
            // Handle REJECTED or other statuses via standard JPA
            Application app = applicationRepository.findById(applicationId)
                    .orElseThrow(() -> new RuntimeException("Application not found"));
            app.setStatus(status);
            applicationRepository.save(app);
        }
    }

    // ... (Other existing methods: getApplicationsByJobId, getApplicationCount, getMyApplications, getApplicationDetails) ...
    // (Keep them as they were, I omitted them here for brevity but DO NOT DELETE them from your file)

    public List<Application> getApplicationsByJobId(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        return applicationRepository.findByJob(job);
    }

    public long getApplicationCount(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow();
        return applicationRepository.countByJob(job);
    }

    public List<Application> getMyApplications(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        WorkerProfile worker = workerRepository.findByUser(user).orElseThrow();
        return applicationRepository.findByWorker(worker);
    }

    public ApplicationDetailsDTO getApplicationDetails(Long applicationId) {
        Application application = applicationRepository.findById(applicationId).orElseThrow();
        List<FieldResponse> fieldResponses = fieldResponseRepository.findByApplication(application);

        ApplicationDetailsDTO dto = new ApplicationDetailsDTO();
        dto.setCoverLetter(application.getCoverLetter());

        List<ApplicationDetailsDTO.QuestionAnswer> qaList = fieldResponses.stream().map(fr -> {
            ApplicationDetailsDTO.QuestionAnswer qa = new ApplicationDetailsDTO.QuestionAnswer();
            qa.setQuestion(fr.getCustomField().getQuestion());
            qa.setAnswer(fr.getResponseValue());
            return qa;
        }).toList();

        dto.setResponses(qaList);
        return dto;
    }
}