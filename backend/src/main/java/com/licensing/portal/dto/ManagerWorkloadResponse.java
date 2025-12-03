package com.licensing.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ManagerWorkloadResponse {
    private Long userId;
    private String username;
    private String fullName;
    private Long taskCount;
}
