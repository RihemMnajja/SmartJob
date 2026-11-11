package com.smartjob.dto;

import com.smartjob.model.ApplicationStatus;

public class StatusRequest {

    private ApplicationStatus status;

    public StatusRequest() {
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }
}
