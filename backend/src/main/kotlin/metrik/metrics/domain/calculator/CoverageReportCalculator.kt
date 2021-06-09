package metrik.metrics.domain.calculator

import com.beust.klaxon.Klaxon
import metrik.metrics.domain.model.CoverageMetrics
import metrik.project.domain.model.Build
import metrik.project.domain.model.Status
import metrik.project.domain.service.jenkins.CoverageSummary
import java.math.RoundingMode

class CoverageReportCalculator {
  fun calculateValue(allBuilds: List<Build>, startTimestamp: Long, endTimestamp: Long): CoverageMetrics {
    var packagesValue = 0.0
    var filesValue = 0.0
    var classesValue = 0.0
    var linesValue = 0.0
    var conditionalsValue = 0.0
    var count = 0
    allBuilds.groupBy { it.pipelineId }.forEach { pipeLineBuilds ->
      val filteredBuildsInGivenTimeRange = getSucceedBuildsUnderTimeRange(pipeLineBuilds, startTimestamp, endTimestamp)
      val buildOrderByTimestampAscending = filteredBuildsInGivenTimeRange.sortedBy { build -> build.timestamp }
      if (buildOrderByTimestampAscending.isNotEmpty()) {
        val latestBuild = buildOrderByTimestampAscending.last()
        val coverageSummary = Klaxon().parse<CoverageSummary>(latestBuild.coverageDetails)!!
        packagesValue += coverageSummary.results.elements.find { x -> x.name == "Packages" }!!.ratio
        filesValue += coverageSummary.results.elements.find { x -> x.name == "Files" }!!.ratio
        classesValue += coverageSummary.results.elements.find { x -> x.name == "Classes" }!!.ratio
        linesValue += coverageSummary.results.elements.find { x -> x.name == "Lines" }!!.ratio
        conditionalsValue += coverageSummary.results.elements.find { x -> x.name == "Conditionals" }!!.ratio
        count++
      }
    }
    return CoverageMetrics(
         divide(packagesValue, count),
         divide(filesValue, count),
         divide(classesValue, count),
         divide(linesValue, count),
         divide(conditionalsValue, count),
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
