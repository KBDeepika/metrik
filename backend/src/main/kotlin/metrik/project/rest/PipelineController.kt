package metrik.project.rest

import metrik.project.rest.applicationservice.PipelineApplicationService
import metrik.project.rest.vo.request.PipelineRequest
import metrik.project.rest.vo.request.PipelineVerificationRequest
import metrik.project.rest.vo.response.PipelineResponse
import metrik.project.rest.vo.response.PipelineStagesResponse
import org.bson.types.ObjectId
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import javax.validation.Valid

@RestController
@RequestMapping("/api")
class PipelineController {
    @Autowired
    private lateinit var pipelineApplicationService: PipelineApplicationService

    @PostMapping("/pipeline/verify")
    @ResponseStatus(HttpStatus.OK)
    fun verifyPipeline(@RequestBody @Valid pipelineVerificationRequest: PipelineVerificationRequest) {
        pipelineApplicationService.verifyPipelineConfiguration(pipelineVerificationRequest.toPipeline())
    }

    @PostMapping("/project/{projectId}/pipeline")
    @ResponseStatus(HttpStatus.CREATED)
    fun createPipeline(
        @PathVariable("projectId") projectId: String,
        @RequestBody @Valid pipelineRequest: PipelineRequest
    ) {
        pipelineApplicationService.createPipeline(
            pipelineRequest.toPipeline(
                projectId,
                ObjectId().toString()
            )
        )
    }

    @PutMapping("/project/{projectId}/pipeline/{pipelineId}")
    fun updatePipeline(
        @PathVariable("projectId") projectId: String,
        @PathVariable("pipelineId") pipelineId: String,
        @RequestBody @Valid pipelineRequest: PipelineRequest
    ) {
        pipelineApplicationService.updatePipeline(
            pipelineRequest.toPipeline(
                projectId,
                pipelineId
            )
        )
    }

    @GetMapping("/project/{projectId}/pipeline/{pipelineId}")
    fun getPipeline(
        @PathVariable("projectId") projectId: String,
        @PathVariable("pipelineId") pipelineId: String
    ): PipelineResponse {
        return PipelineResponse(pipelineApplicationService.getPipeline(projectId, pipelineId))
    }

    @DeleteMapping("/project/{projectId}/pipeline/{pipelineId}")
    @ResponseStatus(HttpStatus.OK)
    fun deletePipeline(
        @PathVariable("projectId") projectId: String,
        @PathVariable("pipelineId") pipelineId: String
    ) {
        pipelineApplicationService.deletePipeline(projectId, pipelineId)
    }

    @GetMapping("/project/{projectId}/pipelines-stages")
    fun getPipelineStages(@PathVariable("projectId") projectId: String): List<PipelineStagesResponse> {
        return pipelineApplicationService.getPipelineStages(projectId)
    }
}