package metrik.metrics.domain.calculator

import com.beust.klaxon.Klaxon
import metrik.metrics.domain.model.CoverageMetrics
import metrik.project.domain.model.Build
import metrik.project.domain.model.Status
import metrik.project.domain.service.jenkins.CoverageSummary
import java.math.RoundingMode

class CoverageReportCalculator {
  fun calculateValue(allBuilds: List<Build>, startTimestamp: Long, endTimestamp: Long): CoverageMetrics {
    var filesValue = 0.0
    var linesValue = 0.0
    var count = 0
    allBuilds.groupBy { it.pipelineId }.forEach { pipeLineBuilds ->
      val filteredBuildsInGivenTimeRange = getSucceedBuildsUnderTimeRange(pipeLineBuilds, startTimestamp, endTimestamp)
      val buildOrderByTimestampAscending = filteredBuildsInGivenTimeRange.sortedBy { build -> build.timestamp }
      if (buildOrderByTimestampAscending.isNotEmpty()) {
        val latestBuild = buildOrderByTimestampAscending.last()
        val coverageSummary = Klaxon().parse<CoverageSummary>(latestBuild.coverageDetails)!!
        filesValue += coverageSummary.results.elements.find { x -> x.name == "Files" }!!.ratio
        linesValue += coverageSummary.results.elements.find { x -> x.name == "Lines" }!!.ratio
        count++
      }
    }
    return CoverageMetrics(
         divide(filesValue, count),
         divide(linesValue, count),
         startTimestamp, endTimestamp)
    }

  private fun getSucceedBuildsUnderTimeRange(pipeLineBuilds : Map.Entry<String, List<Build>>, startTimestamp: Long, endTimestamp: Long) : List<Build>{
    return pipeLineBuilds.value.filter {
      build -> (build.timestamp in startTimestamp..endTimestamp) && (build.result == Status.SUCCESS)
    }
  }

  private fun divide(numerator : Double, denominator : Int) : Double{
    val div = numerator.div(denominator)
    if(div.isNaN()) return 0.0
    return div.toBigDecimal().setScale(2, RoundingMode.HALF_UP).toDouble()
  }
}
