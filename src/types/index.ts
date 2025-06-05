export interface DraftMessage {
    messageID?: string;
    sessionID?: string;
    role: string;
    content: string;
    createdAt: Date;
    isThinking: boolean | null;
    thinkingText: string | null;
}
  

export interface SingleMessage {
    messageID:  string | null;
    sessionID:  string | null;
    role:       string;
    content:    string;
    createdAt:  Date | null;
    isThinking: boolean;
    thinkingText: string;
}

export interface User {
    userID:     string | null;
    firstName:  string;
    lastName:   string;
    email:      string;
    summary:    string
    pfpURL:     string;
}

export interface Project {
    userId: string;
    projectId: string;
    projectName: string;
    projectDescription: string;
    githubUrl: string;
    projectUrl: string;
    projectStartDate: string;
    projectEndDate: string;
}

export interface ApiProject {
    user_id: string;
    project_id: string;
    project_name: string;
    project_description: string;
    github_url: string;
    project_url: string;
    project_start_date: string;
    project_end_date: string;
}

export interface Education {
    educationId: number;
    userId: string;
    institutionName: string;
    degreeType: string | null;
    degreeName: string | null;
    enrollmentDate: string | null;
    graduationDate: string | null;
}

export interface ApiEducation {
    education_id: number;
    user_id: string;
    institution_name: string;
    degree_type: string | null;
    degree_name: string | null;
    enrollment_date: string | null;
    graduation_date: string | null;
}

export interface Experience {
    experienceId: number;
    userId: string;
    companyName: string;
    startDate: string | null;
    endDate: string | null;
    experienceDescription: string | null;
    jobTitle: string | null;
    location: string | null;
}

export interface ApiExperience {
    experience_id: number;
    user_id: string;
    company_name: string;
    start_date: string | null;
    end_date: string | null;
    experience_description: string | null;
    job_title: string | null;
    location: string | null;
}

export interface Skill {
    skillId: number;
    userId: string;
    skillName: string | null;
}

export interface ApiSkill {
    skill_id: number;
    user_id: string;
    skill_name: string | null;
}

export interface UserFound {
    userId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    jobTitle: string;
    companyName: string;
    pfpUrl: string;
    projects: Project[];
    educations: Education[];
    experiences: Experience[];
    skills: Skill[];
}

export interface ApiUserFound {
    user_id: string | null;
    first_name: string;
    last_name: string;
    email: string;
    job_title: string;
    company_name: string;
    pfp_url: string;
    projects: ApiProject[];
    educations: ApiEducation[];
    experiences: ApiExperience[];
    skills: ApiSkill[];
}

export interface Session {
    sessionID:  string | null;
    userID:     string | null;
    title:      string | null;
    createdAt:  Date;
}

export interface SearchResult {
    usersFound:  UserFound[];
    query:          string;
    totalCount:     number;
}

export function mapApiProjectToProject(apiProject: ApiProject): Project {
    return {
        userId: apiProject.user_id,
        projectId: apiProject.project_id,
        projectName: apiProject.project_name,
        projectDescription: apiProject.project_description,
        githubUrl: apiProject.github_url,
        projectUrl: apiProject.project_url,
        projectStartDate: apiProject.project_start_date,
        projectEndDate: apiProject.project_end_date,
    };
}

export function mapApiEducationToEducation(apiEducation: ApiEducation): Education {
    return {
        educationId: apiEducation.education_id,
        userId: apiEducation.user_id,
        institutionName: apiEducation.institution_name,
        degreeType: apiEducation.degree_type,
        degreeName: apiEducation.degree_name,
        enrollmentDate: apiEducation.enrollment_date,
        graduationDate: apiEducation.graduation_date,
    };
}

export function mapApiExperienceToExperience(apiExperience: ApiExperience): Experience {
    return {
        experienceId: apiExperience.experience_id,
        userId: apiExperience.user_id,
        companyName: apiExperience.company_name,
        startDate: apiExperience.start_date,
        endDate: apiExperience.end_date,
        experienceDescription: apiExperience.experience_description,
        jobTitle: apiExperience.job_title,
        location: apiExperience.location,
    };
}

export function mapApiSkillToSkill(apiSkill: ApiSkill): Skill {
    return {
        skillId: apiSkill.skill_id,
        userId: apiSkill.user_id,
        skillName: apiSkill.skill_name,
    };
}

export function mapApiUserFoundToUserFound(apiUserFound: ApiUserFound): UserFound {
    return {
        userId: apiUserFound.user_id,
        firstName: apiUserFound.first_name,
        lastName: apiUserFound.last_name,
        email: apiUserFound.email,
        jobTitle: apiUserFound.job_title,
        companyName: apiUserFound.company_name,
        pfpUrl: apiUserFound.pfp_url,
        projects: apiUserFound.projects.map(mapApiProjectToProject),
        educations: apiUserFound.educations.map(mapApiEducationToEducation),
        experiences: apiUserFound.experiences.map(mapApiExperienceToExperience),
        skills: apiUserFound.skills.map(mapApiSkillToSkill),
    };
}
