package metrik.project.domain.service.jenkins

import org.apache.logging.log4j.util.Strings

data class CoverageSummary(
     val results : Coverage = Coverage()
)

data class Coverage (
     val children: List<Coverage> = emptyList(),
     val elements: List<Element> = emptyList(),
     val name: String = Strings.EMPTY
)

data class Element (
     val denominator : Double = 0.0,
     val name : String = Strings.EMPTY,
     val numerator : Double = 0.0,
     val ratio : Double = 0.0
)