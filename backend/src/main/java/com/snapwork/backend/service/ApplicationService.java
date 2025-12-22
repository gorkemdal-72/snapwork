package com.snapwork.backend.service;

import com.snapwork.backend.dto.ApplicationDetailsDTO;
import com.snapwork.backend.dto.ApplicationRequest;
import com.snapwork.backend.entity.*;
import com.snapwork.backend.enums.JobStatus;
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
        // Validate Job existence
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        // Validate User existence
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Validate Worker Profile existence
        WorkerProfile worker = workerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Error: You must create a Worker Profile to apply!"));

        // Prevent applying to own job
        if (job.getEmployer().getUser().getUserId().equals(request.getUserId())) {
            throw new RuntimeException("You cannot apply to your own job!");
        }

        // Check if already applied (Optional but recommended)
        if (applicationRepository.existsByJobAndWorker(job, worker)) {
            throw new RuntimeException("You have already applied for this job!");
        }

        Application application = new Application();
        application.setJob(job);
        application.setWorker(worker);

        // Set Enum status directly
        application.setStatus(JobStatus.PENDING);

        application.setCoverLetter(request.getCoverLetter());

        Application savedApp = applicationRepository.save(application);

        // Save Custom Field Responses
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
        String msg = "New Application: " + worker.getUser().getFirstName() + " " + worker.getUser().getLastName() + " applied for '" + job.getTitle() + "'";
        Long employerUserId = job.getEmployer().getUser().getUserId();

        // Target URL: Applicants Page
        String url = "/job-applications/" + job.getJobId();

        notificationService.sendNotification(employerUserId, msg, url);
    }

    // 2. UPDATE STATUS (Accept/Reject)
    // NOW WITH NOTIFICATION!
    public void updateApplicationStatus(Long applicationId, String status) {
        // 1. Find application
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));

        // 2. Convert String status to Enum and set
        try {
            JobStatus statusEnum = JobStatus.valueOf(status.toUpperCase());
            app.setStatus(statusEnum);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + status);
        }

        // 3. Save (Standard JPA update)
        applicationRepository.save(app);

        // --- NOTIFICATION TRIGGER 2: Notify Worker (NEW) ---
        // This part was missing! Now the worker gets notified.
        String jobTitle = app.getJob().getTitle();
        String statusMessage = status.equalsIgnoreCase("ACCEPTED") ? "Accepted! 🎉" : "Rejected.";

        String msg = "Your application for '" + jobTitle + "' has been " + statusMessage;
        Long workerUserId = app.getWorker().getUser().getUserId();

        // Target URL: My Applications Page
        String url = "/my-applications/" + workerUserId;

        notificationService.sendNotification(workerUserId, msg, url);
    }

    public List<Application> getApplicationsByJobId(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.findByJob(job);
    }

    public long getApplicationCount(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        return applicationRepository.countByJob(job);
    }

    public List<Application> getMyApplications(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        WorkerProfile worker = workerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Worker profile not found"));
        return applicationRepository.findByWorker(worker);
    }

    public ApplicationDetailsDTO getApplicationDetails(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

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