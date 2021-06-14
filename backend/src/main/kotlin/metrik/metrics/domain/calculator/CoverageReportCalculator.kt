package metrik.metrics.domain.calculator

import com.beust.klaxon.Klaxon
import metrik.metrics.domain.model.LEVEL
import metrik.project.domain.model.Build
import metrik.project.domain.model.Status
import metrik.project.domain.service.jenkins.CoverageSummary
import java.math.RoundingMode

class CoverageReportCalculator {
  fun calculateValue(allBuilds: List<Build>, startTimestamp: Long, endTimestamp: Long, type: String): Number {
    var value = 0.0
    var count = 0
    allBuilds.groupBy { it.pipelineId }.forEach { pipeLineBuilds ->
      val filteredBuildsInGivenTimeRange = getSucceedBuildsUnderTimeRange(pipeLineBuilds, startTimestamp, endTimestamp)
      val buildOrderByTimestampAscending = filteredBuildsInGivenTimeRange.sortedBy { build -> build.timestamp }
      if (buildOrderByTimestampAscending.isNotEmpty()) {
        val latestBuild = buildOrderByTimestampAscending.last()
        if(latestBuild.coverageDetails.isNotEmpty()){
          val coverageSummary = Klaxon().parse<CoverageSummary>(latestBuild.coverageDetails)!!
          value += coverageSummary.results.elements.find { x -> x.name == type }!!.ratio
          count++
        }
      }
    }
    return divide(value, count);
  }

  fun calculateLevel(value: Number): LEVEL {
    val coverageVale: Double = value.toDouble()

    return when {
      coverageVale < 40 -> {
        LEVEL.LOW
      }
      coverageVale < 70 -> {
        LEVEL.MEDIUM
      }
      coverageVale < 90 -> {
        LEVEL.HIGH
      }
      else -> {
        LEVEL.ELITE
      }
    }
  }

  private fun getSucceedBuildsUnderTimeRange(pipeLineBuilds : Map.Entry<String, List<Build>>, startTimestamp: Long, endTimestamp: Long) : List<Build>{
    return pipeLineBuilds.value.filter {
      build -> (build.timestamp in startTimestamp..endTimestamp) && (build.result == Status.SUCCESS)
    }
  }

  private fun divide(numerator : Double, denominator : Int) : Number {
    val div = numerator.div(denominator)
    if(div.isNaN()) return 0.0
    return div.toBigDecimal().setScale(2, RoundingMode.HALF_UP)
  }
}
