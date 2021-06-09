package metrik.metrics.domain.model

import com.fasterxml.jackson.databind.annotation.JsonSerialize

data class CoverageMetrics(
     val packagesValue: Double,
     val filesValue: Double,
     val classesValue: Double,
     val linesValue: Double,
     val condtionalsValue: Double,
     val startTimestamp: Long,
     val endTimestamp: Long
)
