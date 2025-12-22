package com.snapwork.backend.service;

import com.snapwork.backend.dto.ApplyJobRequest;
import com.snapwork.backend.dto.JobRequest;
import com.snapwork.backend.dto.CustomFieldDTO;
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
        // 1. Find User
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // 2. Find Employer Profile
        EmployerProfile employer = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Employer profile not found! You must be an employer to post a job."));

        Job job = new Job();
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

        // Assign Employer to Job
        job.setEmployer(employer);

        Job savedJob = jobRepository.save(job);

        // Save Custom Fields
        List<CustomFieldDTO> fieldDTOs = request.getCustomFields();
        if (fieldDTOs != null && !fieldDTOs.isEmpty()) {
            for (CustomFieldDTO fieldDTO : fieldDTOs) {
                CustomField customField = new CustomField();
                customField.setJob(savedJob);
                customField.setQuestion(fieldDTO.getQuestion());
                customField.setFieldType(fieldDTO.getFieldType());
                customField.setOptions(fieldDTO.getOptions());
                customField.setRequired(fieldDTO.isRequired());

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

    // 6. UPDATE JOB (AND NOTIFY APPLICANTS)
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

        Job savedJob = jobRepository.save(job);

        // --- EKLENEN KISIM: Başvuranlara Bildirim Gönder ---
        List<Application> applications = applicationRepository.findByJob(savedJob);
        for (Application app : applications) {
            String msg = "Update: The job '" + savedJob.getTitle() + "' you applied for has been updated by the employer.";
            // İş detayına yönlendir
            String url = "/jobs/" + savedJob.getJobId();

            notificationService.sendNotification(app.getWorker().getUser().getUserId(), msg, url);
        }
        // ----------------------------------------------------

        return savedJob;
    }

    // 7. MARK JOB AS COMPLETED
    public void completeJob(Long jobId, Long userId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getEmployer().getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You do not own this job.");
        }

        jobRepository.completeJobManually(jobId);
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
                if (app.getStatus() == JobStatus.ACCEPTED && app.getJob().getStatus() == JobStatus.COMPLETED) {
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

        // Notify all applicants
        List<Application> applications = applicationRepository.findByJob(job);
        for (Application app : applications) {
            String msg = "Job '" + job.getTitle() + "' has been cancelled by the employer.";
            notificationService.sendNotification(app.getWorker().getUser().getUserId(), msg, "/my-applications");
        }
    }

    // 11. APPLY FOR JOB
    public void applyForJob(ApplyJobRequest request) {
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found!"));

        User user = userRepository.findById(request.getWorkerId())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        WorkerProfile worker = workerProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("You must create a Worker Profile before applying!"));

        boolean alreadyApplied = applicationRepository.existsByJobAndWorker(job, worker);
        if (alreadyApplied) {
            throw new RuntimeException("You have already applied for this job!");
        }

        if (job.getEmployer().getUser().getUserId().equals(request.getWorkerId())) {
            throw new RuntimeException("You cannot apply to your own job!");
        }

        Application app = new Application();
        app.setJob(job);
        app.setWorker(worker);
        app.setStatus(JobStatus.PENDING);
        app.setCoverLetter(request.getCoverLetter());
        app.setProposedPrice(request.getProposedPrice());

        applicationRepository.save(app);

        // Notify Employer
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