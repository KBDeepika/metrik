package metrik.metrics.rest

import com.fasterxml.jackson.databind.ObjectMapper
import metrik.metrics.domain.model.LEVEL
import metrik.metrics.domain.model.Metrics
import metrik.metrics.domain.model.MetricsUnit
import metrik.metrics.rest.vo.FourKeyMetricsResponse
import metrik.metrics.rest.vo.MetricsInfo
import metrik.metrics.rest.vo.MetricsQueryRequest
import metrik.metrics.rest.vo.PipelineStageRequest
import org.junit.jupiter.api.Test
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath

@WebMvcTest(controllers = [MetricsController::class])
internal class MetricsControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var metricsApplicationService: MetricsApplicationService

    @Test
    internal fun `should return metrics response when call api`() {
        val pipelineA = PipelineStageRequest("pipelineA", "stageA")
        val pipelineB = PipelineStageRequest("pipelineB", "stageB")
        val startTime = 1609459200000L
        val endTime = 1611964800000L
        val metricUnit = MetricsUnit.Fortnightly
        val level = LEVEL.ELITE
        val value = 10.2
        val requestBody = MetricsQueryRequest(startTime, endTime, metricUnit, listOf(pipelineA, pipelineB))

        val metric = Metrics(value, startTime, endTime)
        val summary = Metrics(value, level, startTime, endTime)
        val metrics = MetricsInfo(summary, listOf(metric, metric))
        val expectedResponse = FourKeyMetricsResponse(
            deploymentFrequency = metrics,
            leadTimeForChange = metrics,
            changeFailureRate = metrics,
            meanTimeToRestore = metrics,
            linesCoverageReport = metrics
        )
        `when`(
            metricsApplicationService.retrieve4KeyMetrics(
                requestBody.pipelineStages,
                requestBody.startTime,
                requestBody.endTime,
                requestBody.unit,
            )
        ).thenReturn(expectedResponse)

        mockMvc.perform(
            post("/api/pipeline/metrics")
                .contentType(MediaType.APPLICATION_JSON)
                .content(ObjectMapper().writeValueAsString(requestBody))
        )
            .andExpect(jsonPath("$.leadTimeForChange.summary.level").value("ELITE"))
            .andExpect(jsonPath("$.leadTimeForChange.summary.value").value(value))
            .andExpect(jsonPath("$.leadTimeForChange.summary.startTimestamp").value(startTime))
            .andExpect(jsonPath("$.leadTimeForChange.summary.endTimestamp").value(endTime))
            .andExpect(jsonPath("$.leadTimeForChange.details.length()").value(2))
            .andExpect(jsonPath("$.leadTimeForChange.details[0].startTimestamp").value(startTime))
            .andExpect(jsonPath("$.leadTimeForChange.details[0].endTimestamp").value(endTime))
            .andExpect(jsonPath("$.leadTimeForChange.details[0].value").value(value))
            .andExpect(jsonPath("$.changeFailureRate").isNotEmpty)
            .andExpect(jsonPath("$.meanTimeToRestore").isNotEmpty)
            .andExpect(jsonPath("$.linesCoverageReport").isNotEmpty)
    }

    @Test
    internal fun `should return metrics response when call get api`() {
        val pipelineId = "test pipeline Id"
        val targetStage = "Deploy to UAT"
        val startTime = 1609459200000L
        val endTime = 1611964800000L
        val metricUnit = MetricsUnit.Fortnightly
        val level = LEVEL.ELITE
        val value = 10.2

        val metric = Metrics(value, startTime, endTime)
        val summary = Metrics(value, level, startTime, endTime)
        val metrics = MetricsInfo(summary, listOf(metric, metric))
        val expectedResponse = FourKeyMetricsResponse(
            deploymentFrequency = metrics,
            leadTimeForChange = metrics,
            changeFailureRate = metrics,
            meanTimeToRestore = metrics,
            linesCoverageReport = metrics
        )
        `when`(
            metricsApplicationService.retrieve4KeyMetrics(
                listOf(PipelineStageRequest(pipelineId, targetStage)),
                startTime,
                endTime,
                metricUnit
            )
        ).thenReturn(expectedResponse)

        mockMvc.perform(
            get("/api/pipeline/metrics")
                .param("pipelineId", pipelineId)
                .param("targetStage", targetStage)
                .param("startTime", startTime.toString())
                .param("endTime", endTime.toString())
                .param("unit", metricUnit.toString())
        )
            .andExpect(jsonPath("$.leadTimeForChange.summary.level").value("ELITE"))
            .andExpect(jsonPath("$.leadTimeForChange.summary.value").value(value))
            .andExpect(jsonPath("$.leadTimeForChange.summary.startTimestamp").value(startTime))
            .andExpect(jsonPath("$.leadTimeForChange.summary.endTimestamp").value(endTime))
            .andExpect(jsonPath("$.leadTimeForChange.details.length()").value(2))
            .andExpect(jsonPath("$.leadTimeForChange.details[0].startTimestamp").value(startTime))
            .andExpect(jsonPath("$.leadTimeForChange.details[0].endTimestamp").value(endTime))
            .andExpect(jsonPath("$.leadTimeForChange.details[0].value").value(value))
            .andExpect(jsonPath("$.changeFailureRate").isNotEmpty)
            .andExpect(jsonPath("$.meanTimeToRestore").isNotEmpty)
            .andExpect(jsonPath("$.linesCoverageReport").isNotEmpty)
    }
}