package metrik.project.rest.applicationservice

import metrik.project.rest.vo.request.ProjectRequest
import metrik.project.rest.vo.response.ProjectDetailResponse
import metrik.project.rest.vo.response.ProjectResponse
import metrik.project.rest.vo.response.ProjectSummaryResponse
import metrik.project.exception.ProjectNameDuplicateException
import metrik.project.domain.model.Project
import metrik.project.domain.repository.BuildRepository
import metrik.project.domain.repository.ProjectRepository
import metrik.project.domain.repository.PipelineRepository
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ProjectApplicationService {
    @Autowired
    private lateinit var pipelineApplicationService: PipelineApplicationService

    @Autowired
    private lateinit var projectRepository: ProjectRepository

    @Autowired
    private lateinit var pipelineRepository: PipelineRepository

    @Autowired
    private lateinit var buildRepository: BuildRepository

    @Transactional
    fun createProject(projectRequest: ProjectRequest): ProjectSummaryResponse {
        val projectName = projectRequest.projectName
        if (projectRepository.existWithGivenName(projectName)) {
            throw ProjectNameDuplicateException()
        }

        val projectId = ObjectId().toString()
        val pipelineId = ObjectId().toString()
        val pipeline = projectRequest.pipeline.toPipeline(projectId, pipelineId)
        pipelineApplicationService.verifyPipelineConfiguration(pipeline)

        val savedProject = projectRepository.save(Project(name = projectName, id = projectId))
        pipelineRepository.saveAll(listOf(pipeline))
        return ProjectSummaryResponse(savedProject)
    }

    fun updateProjectName(projectId: String, projectName: String): ProjectResponse {
        val project = projectRepository.findById(projectId)
        project.name = projectName
        return ProjectResponse(projectRepository.save(project))
    }

    fun getProjects(): List<ProjectResponse> {
        return projectRepository.findAll().map { ProjectResponse(it) }
    }

    @Transactional
    fun deleteProject(projectId: String) {
        val project = projectRepository.findById(projectId)
        val pipelines = pipelineRepository.findByProjectId(project.id)
        pipelines.forEach {
            pipelineRepository.deleteById(it.id)
            buildRepository.clear(it.id)
        }
        projectRepository.deleteById(project.id)
    }

    fun getProjectDetails(projectId: String): ProjectDetailResponse {
        val project = projectRepository.findById(projectId)
        val pipelines = pipelineRepository.findByProjectId(projectId)

        return ProjectDetailResponse(project, pipelines)
    }
}