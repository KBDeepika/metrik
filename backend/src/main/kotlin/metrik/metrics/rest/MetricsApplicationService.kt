package metrik.metrics.rest

import metrik.metrics.domain.calculator.*
import metrik.metrics.domain.model.CoverageMetrics
import metrik.metrics.domain.model.Metrics
import metrik.metrics.domain.model.MetricsUnit
import metrik.metrics.exception.BadRequestException
import metrik.metrics.rest.vo.FourKeyMetricsResponse
import metrik.metrics.rest.vo.MetricsInfo
import metrik.metrics.rest.vo.PipelineStageRequest
import metrik.project.domain.model.Build
import metrik.project.domain.repository.BuildRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.util.*

@Service
class MetricsApplicationService {


    companion object {
        private const val FORTNIGHT_DURATION: Int = 14
        private const val MONTH_DURATION: Int = 30
    }


    @Autowired
    private lateinit var deploymentFrequencyCalculator: DeploymentFrequencyCalculator

    @Autowired
    private lateinit var changeFailureRateCalculator: ChangeFailureRateCalculator

    @Autowired
    private lateinit var leadTimeForChangeCalculator: LeadTimeForChangeCalculator

    @Autowired
    private lateinit var meanTimeToRestoreCalculator: MeanTimeToRestoreCalculator

    @Autowired
    private lateinit var buildRepository: BuildRepository

    @Autowired
    private lateinit var timeRangeSplitter: TimeRangeSplitter

    fun retrieve4KeyMetrics(
        pipelineWithStages: List<PipelineStageRequest>,
        startTimestamp: Long,
        endTimestamp: Long,
        unit: MetricsUnit
    ): FourKeyMetricsResponse {
        validateTime(startTimestamp, endTimestamp)
        val pipelineStageMap = pipelineWithStages.map { Pair(it.pipelineId, it.stage) }.toMap()
        val allBuilds = buildRepository.getAllBuilds(pipelineStageMap.keys)
        val timeRangeByUnit: List<Pair<Long, Long>> = timeRangeSplitter.split(startTimestamp, endTimestamp, unit)

        return FourKeyMetricsResponse(
            generateDeployFrequencyMetrics(
                allBuilds,
                startTimestamp,
                endTimestamp,
                pipelineStageMap,
                timeRangeByUnit,
                unit,
                deploymentFrequencyCalculator,
            ),
            generateMetrics(
                allBuilds,
                startTimestamp,
                endTimestamp,
                pipelineStageMap,
                timeRangeByUnit,
                leadTimeForChangeCalculator,
            ),
            generateMetrics(
                allBuilds,
                startTimestamp,
                endTimestamp,
                pipelineStageMap,
                timeRangeByUnit,
                meanTimeToRestoreCalculator,
            ),
            generateMetrics(
                allBuilds,
                startTimestamp,
                endTimestamp,
                pipelineStageMap,
                timeRangeByUnit,
                changeFailureRateCalculator,
            ),
            generateCoverageReportMetrics(
                 allBuilds,
                 startTimestamp,
                 endTimestamp,
                 CoverageReportCalculator()
            )
        )
    }

    private fun validateTime(startTimestamp: Long, endTimestamp: Long) {
        if (startTimestamp >= endTimestamp) {
            throw BadRequestException("start time should be earlier than end time")
        }
    }

    private fun generateMetrics(
        allBuilds: List<Build>,
        startTimeMillis: Long,
        endTimeMillis: Long,
        pipelineStagesMap: Map<String, String>,
        timeRangeByUnit: List<Pair<Long, Long>>,
        calculator: MetricsCalculator
    ): MetricsInfo {
        val valueForWholeRange = calculator.calculateValue(allBuilds, startTimeMillis, endTimeMillis, pipelineStagesMap)
        val summary = Metrics(
            valueForWholeRange,
            calculator.calculateLevel(valueForWholeRange),
            startTimeMillis,
            endTimeMillis
        )
        val details = timeRangeByUnit
            .map {
                val valueForUnitRange =
                    calculator.calculateValue(allBuilds, it.first, it.second, pipelineStagesMap)
                Metrics(valueForUnitRange, it.first, it.second)
            }
        return MetricsInfo(summary, details)
    }

    private fun generateDeployFrequencyMetrics(
        allBuilds: List<Build>,
        startTimeMillis: Long,
        endTimeMillis: Long,
        pipelineStagesMap: Map<String, String>,
        timeRangeByUnit: List<Pair<Long, Long>>,
        unit: MetricsUnit,
        calculator: DeploymentFrequencyCalculator
    ): MetricsInfo {
        val days = getDuration(startTimeMillis, endTimeMillis)
        val deploymentCount = calculator.calculateValue(
            allBuilds, startTimeMillis, endTimeMillis,
            pipelineStagesMap
        )
        val factor = if (unit == MetricsUnit.Fortnightly) FORTNIGHT_DURATION else MONTH_DURATION

        val deploymentCountPerUnit = deploymentCount.toDouble().div(days).times(factor)

        val summary = Metrics(
            deploymentCountPerUnit,
            calculator.calculateLevel(deploymentCount, days),
            startTimeMillis,
            endTimeMillis
        )
        val details = timeRangeByUnit
            .map {
                val valueForUnitRange =
                    calculator.calculateValue(allBuilds, it.first, it.second, pipelineStagesMap)
                Metrics(valueForUnitRange, it.first, it.second)
            }
        return MetricsInfo(summary, details)
    }

    private fun generateCoverageReportMetrics(
         allBuilds: List<Build>,
         startTimeMillis: Long,
         endTimeMillis: Long,
         calculator: CoverageReportCalculator
    ): List<CoverageMetrics> {

        val timeRangeByUnit: List<Pair<Long, Long>> = timeRangeSplitter.split(startTimeMillis, endTimeMillis, MetricsUnit.Daily)

        return timeRangeByUnit.map{ time ->
            calculator.calculateValue(allBuilds, time.first, time.second)
        }.filter { coverageMetrics -> coverageMetrics.packagesValue > 0.0 }
    }

    private fun getDuration(startTimestamp: Long, endTimestamp: Long): Int {
        val getTimeZone = TimeZone.getDefault().toZoneId()
        val startDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(startTimestamp), getTimeZone)
        val endDateTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(endTimestamp), getTimeZone)

        return Duration.between(startDateTime, endDateTime).toDays().toInt() + 1
    }
}
