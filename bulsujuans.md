# ACCOUNT DEMO

| Role        | Description                               | Email                                                                                                 |
| ----------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Admin       | Admin account for managing website        | [heralatrina+admin@gmail.com](mailto:heralatrina+admin@gmail.com)                                     |
| Student     | Student                                   | [heralatrina+student_regular@gmail.com](mailto:heralatrina+student_regular@gmail.com)                 |
| Student     | Student account for Student Affair Office | [heralatrina+student_student_affairs@gmail.com](mailto:heralatrina+student_student_affairs@gmail.com) |
| Teacher     | Teacher account for Guidance Office       | [heralatrina+teacher_guidance@gmail.com](mailto:heralatrina+teacher_guidance@gmail.com)               |
| Teacher     | Teacher account for Health Services       | [heralatrina+teacher_health_services@gmail.com](mailto:heralatrina+teacher_health_services@gmail.com) |
| Teacher     | Teacher account for Security              | [heralatrina+teacher_security@gmail.com](mailto:heralatrina+teacher_security@gmail.com)               |
| Teacher     | Teacher account for Discipline            | [heralatrina+teacher_discipline@gmail.com](mailto:heralatrina+teacher_discipline@gmail.com)           |
| Teacher     | Teacher account for Finance               | [heralatrina+teacher_finance@gmail.com](mailto:heralatrina+teacher_finance@gmail.com)                 |
| Teacher     | Teacher account for Administrative        | [heralatrina+teacher_administrative@gmail.com](mailto:heralatrina+teacher_administrative@gmail.com)   |
| Non-Teacher | Account used for posting on news page     | [heralatrina+nonteacher@gmail.com](mailto:heralatrina+nonteacher@gmail.com)                           |

# Project Flow Chart

```mermaid
flowchart TD
    START([START])

    %% STUDENT FLOW
    START --> STUDENT_LOGIN[Student Login]
    STUDENT_LOGIN --> S_NEWS[View News Page]
    STUDENT_LOGIN --> S_PROFILE[View Profile]
    S_PROFILE --> S_MANAGE_PROFILE[Manage Profile Information]
    STUDENT_LOGIN --> S_COMPLAINT[View Complaint Page]
    S_COMPLAINT --> S_POST_COMPLAINT[Post Complaint]
    S_POST_COMPLAINT --> S_TICKET_CREATED[Ticket Created]
    S_POST_COMPLAINT --> S_ASSIGN_TICKET[Assign Ticket Based on Complaint Category]

    %% Ticket assignment
    S_ASSIGN_TICKET --> BULLY{Bullying?}
    BULLY -->|Yes| DISCIPLINE[Discipline Office]
    BULLY -->|No| HEALTH{Health Concern?}
    HEALTH -->|Yes| HEALTH_OFFICE[Health Services]
    HEALTH -->|No| FINANCE{Finance Concern?}
    FINANCE -->|Yes| FINANCE_OFFICE[Finance Office]
    FINANCE -->|No| OTHER_OFFICE[Respective Office]

    S_POST_COMPLAINT --> S_RESOLVED_CHECK{If Ticket Status = Resolved}
    S_RESOLVED_CHECK --> FEEDBACK[Receive Feedback Form]
    FEEDBACK --> SUBMIT_REVIEW[Submit Review]

    STUDENT_LOGIN --> S_END[End]

    %% TEACHER FLOW
    START --> TEACHER_LOGIN[Teacher Login]
    TEACHER_LOGIN --> T_NEWS[View News Page]
    TEACHER_LOGIN --> T_PROFILE[View Profile]
    T_PROFILE --> T_MANAGE_PROFILE[Manage Profile Information]
    TEACHER_LOGIN --> T_TICKETS[View Tickets Page]
    T_TICKETS --> T_UPDATE_STATUS[Update Ticket Status]
    T_UPDATE_STATUS --> T_DRAG_DROP[Drag and Drop Ticket]
    T_UPDATE_STATUS --> T_RESOLVED_CHECK{If Status = Resolved}
    T_RESOLVED_CHECK --> SYSTEM_FEEDBACK[System Triggers Feedback Form to Student]
    TEACHER_LOGIN --> T_END[End]

    %% NON-TEACHER FLOW
    START --> NON_TEACHER_LOGIN[Non-Teacher Login]
    NON_TEACHER_LOGIN --> NT_NEWS[View News Page]
    NT_NEWS --> NT_POST_CONTENT[Post Content]
    NON_TEACHER_LOGIN --> NT_PROFILE[View Profile]
    NT_PROFILE --> NT_MANAGE_PROFILE[Manage Profile Information]
    NON_TEACHER_LOGIN --> NT_END[End]

    %% ADMIN FLOW
    START --> ADMIN_LOGIN[Admin Login]
    ADMIN_LOGIN --> A_USERS[View Users Page]
    A_USERS --> MANAGE_USERS[Manage Users]
    ADMIN_LOGIN --> A_ROLES[View Role Page]
    A_ROLES --> MANAGE_ROLES[Manage Roles]
    ADMIN_LOGIN --> A_END[End]
```
