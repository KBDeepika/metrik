package metrik.metrics.domain.model

data class CoverageMetrics(
     val packagesValue: Double,
     val filesValue: Double,
     val classesValue: Double,
     val linesValue: Double,
     val conditionalsValue: Double,
     val startTimestamp: Long,
     val endTimestamp: Long
)
