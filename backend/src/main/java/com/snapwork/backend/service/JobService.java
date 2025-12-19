package com.snapwork.backend.service;

import com.snapwork.backend.dto.ApplyJobRequest;
import com.snapwork.backend.dto.JobRequest;
import com.snapwork.backend.dto.CustomFieldDTO; // <-- BU IMPORT EKLENDİ
import com.snapwork.backend.entity.*;
import com.snapwork.backend.enums.JobStatus;
import com.snapwork.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final EmployerProfileRepository employerProfileRepository;
    private final UserRepository userRepository;
    private final CustomFieldRepository customFieldRepository;

    private final WorkerProfileRepository workerProfileRepository;
    private final ApplicationRepository applicationRepository;
    private final NotificationService notificationService;

    public JobService(JobRepository jobRepository,
                      EmployerProfileRepository employerProfileRepository,
                      UserRepository userRepository,
                      CustomFieldRepository customFieldRepository,
                      WorkerProfileRepository workerProfileRepository,
                      ApplicationRepository applicationRepository,
                      NotificationService notificationService) {
        this.jobRepository = jobRepository;
        this.employerProfileRepository = employerProfileRepository;
        this.userRepository = userRepository;
        this.customFieldRepository = customFieldRepository;
        this.workerProfileRepository = workerProfileRepository;
        this.applicationRepository = applicationRepository;
        this.notificationService = notificationService;
    }

    // 1. CREATE JOB
    public Job createJob(JobRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        EmployerProfile employer = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Error: You must create an Employer Profile first!"));

        Job job = new Job();
        job.setEmployer(employer);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setPaymentAmount(request.getPaymentAmount());
        job.setPaymentType(request.getPaymentType());
        job.setWorkDate(request.getWorkDate());
        job.setStartTime(request.getStartTime());
        job.setEndTime(request.getEndTime());
        job.setCity(request.getCity());
        job.setDistrict(request.getDistrict());
        job.setStreetAndBuilding(request.getStreetAndBuilding());

        Job savedJob = jobRepository.save(job);

        List<CustomFieldDTO> fieldDTOs = request.getCustomFields();

        if (fieldDTOs != null && !fieldDTOs.isEmpty()) {
            for (CustomFieldDTO fieldDTO : fieldDTOs) {
                CustomField customField = new CustomField();

                customField.setJob(savedJob);

                customField.setQuestion(fieldDTO.getQuestion());
                customField.setFieldType(fieldDTO.getFieldType());

                customField.setOptions(fieldDTO.getOptions());
                customField.setRequired(fieldDTO.isRequired());
                // ---------------------------------------

                customFieldRepository.save(customField);
            }
        }
        return savedJob;
    }


    // 2. LIST ALL JOBS
    public List<Job> getAllJobs() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    // 3. GET JOBS BY USER
    public List<Job> getJobsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        EmployerProfile employer = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("This user has no employer profile yet."));

        return jobRepository.findByEmployer(employer);
    }

    // 4. DELETE JOB
    public void deleteJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        if (!job.getEmployer().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this job!");
        }
        jobRepository.delete(job);
    }

    // 5. GET JOB BY ID
    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));
    }

    // 6. UPDATE JOB
    public Job updateJob(Long jobId, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        if (!job.getEmployer().getUser().getUserId().equals(request.getUserId())) {
            throw new RuntimeException("You are not authorized to update this job!");
        }

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setPaymentAmount(request.getPaymentAmount());
        job.setPaymentType(request.getPaymentType());
        job.setWorkDate(request.getWorkDate());
        job.setStartTime(request.getStartTime());
        job.setEndTime(request.getEndTime());
        job.setCity(request.getCity());
        job.setDistrict(request.getDistrict());
        job.setStreetAndBuilding(request.getStreetAndBuilding());

        return jobRepository.save(job);
    }

    // 7. MARK JOB AS COMPLETED
    public void completeJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        if (!job.getEmployer().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to complete this job!");
        }

        job.setStatus(JobStatus.COMPLETED);
        jobRepository.save(job);

        List<Application> apps = applicationRepository.findByJob(job);
        for (Application app : apps) {
            if ("ACCEPTED".equals(app.getStatus())) {
                String msg = "Job '" + job.getTitle() + "' is marked as COMPLETED. Please rate your employer!";
                Long workerId = app.getWorker().getUser().getUserId();
                String url = "/completed-jobs";
                notificationService.sendNotification(workerId, msg, url);
            }
        }
    }

    // 8. GET COMPLETED JOBS
    public List<Job> getCompletedJobs(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        List<Job> completedJobs = new ArrayList<>();

        Optional<EmployerProfile> employer = employerProfileRepository.findByUser(user);
        if (employer.isPresent()) {
            List<Job> employerJobs = jobRepository.findCompletedJobs(employer.get());
            completedJobs.addAll(employerJobs);
        }

        Optional<WorkerProfile> worker = workerProfileRepository.findByUser(user);
        if (worker.isPresent()) {
            List<Application> applications = applicationRepository.findByWorker(worker.get());
            for (Application app : applications) {
                if ("ACCEPTED".equals(app.getStatus()) && app.getJob().getStatus() == JobStatus.COMPLETED) {
                    completedJobs.add(app.getJob());
                }
            }
        }

        return completedJobs;
    }

    // 9. GET QUESTIONS FOR A JOB
    public List<CustomField> getJobQuestions(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));
        return customFieldRepository.findByJob(job);
    }

    // 10. CANCEL JOB
    public void cancelJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        if (!job.getEmployer().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to cancel this job!");
        }

        if (job.getStatus() == JobStatus.COMPLETED || job.getStatus() == JobStatus.CANCELLED) {
            throw new RuntimeException("Job is already completed or cancelled!");
        }

        job.setStatus(JobStatus.CANCELLED);
        jobRepository.save(job);

        // send notification all applicants
        List<Application> applications = applicationRepository.findByJob(job);
        for (Application app : applications) {
            String msg = "Job '" + job.getTitle() + "' has been cancelled by the employer.";
            notificationService.sendNotification(app.getWorker().getUser().getUserId(), msg, "/my-applications");
        }
    }

    // 11. APPLY FOR JOB
    public void applyForJob(ApplyJobRequest request) {
        // 1. Find Job
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        // 2. Find User
        User user = userRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 3. Find Worker Profile
        WorkerProfile worker = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("You must create a Worker Profile before applying!"));

        // 4. Check if already applied
        boolean alreadyApplied = applicationRepository.existsByJobAndWorker(job, worker);
        if (alreadyApplied) {
            throw new RuntimeException("You have already applied for this job!");
        }

        // 5. Check if employer is applying to own job
        if (job.getEmployer().getUser().getUserId().equals(request.getWorkerId())) {
            throw new RuntimeException("You cannot apply to your own job!");
        }

        // 6. Create Application
        Application app = new Application();
        app.setJob(job);
        app.setWorker(worker);
        app.setStatus("PENDING");
        app.setCoverLetter(request.getCoverLetter());

        // Set Proposed Price (If provided)
        app.setProposedPrice(request.getProposedPrice());

        applicationRepository.save(app);

        // 7. Send Notification to Employer
        String msg = "New application for '" + job.getTitle() + "': " + user.getFirstName() + " " + user.getLastName();
        if (request.getProposedPrice() != null) {
            msg += " (Offer: " + request.getProposedPrice() + " TL)";
        }

        notificationService.sendNotification(
                job.getEmployer().getUser().getUserId(),
                msg,
                "/job-applications/" + job.getJobId()
        );
    }
}