package metrik.metrics.domain.model

data class CoverageMetrics(
     val filesValue: Double,
     val linesValue: Double,
     val startTimestamp: Long,
     val endTimestamp: Long
)
