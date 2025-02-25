export const metricsExplanations = {
	df: "The number of successful deployments to target environment under the given date range.",
	lt:
		"The average amount of time it takes to go from code commit to code running in target environment under the given date range.",
	mttr:
		"The average amount of time it takes to restore from deployment failures in target environment under the given date range.",
	cfr: "The percentage of deployment failures in target environment under the given date range.",
	ltcr: "The lines test coverage report of the target environment under the given date range",
};

export type Standard = {
	elite: string;
	high: string;
	medium: string;
	low: string;
};

export type MetricsStandard = {
	df: Standard;
	lt: Standard;
	mttr: Standard;
	cfr: Standard;
	ltcr: Standard;
};

export type MetricsStanderMapping = {
	Fortnightly: MetricsStandard;
	Monthly: MetricsStandard;
};

export const metricsStanderMapping: MetricsStanderMapping = {
	Fortnightly: {
		df: {
			elite: "> 14 times",
			high: "2-14 times (14 included)",
			medium: "1-2 times (2 included)",
			low: "≤ 1 time",
		},
		lt: {
			elite: "< 1 day",
			high: "1-7 days (1 included)",
			medium: "7-30 days (7 included)",
			low: "≥ 30 days",
		},
		mttr: {
			elite: "< 1 hour",
			high: "1-24 hours (1 included)",
			medium: "24-168 hours (24 included)",
			low: "≥ 168 hours",
		},
		cfr: {
			elite: "< 15%",
			high: "15%-30% (15 included)",
			medium: "30%-45% (30% included)",
			low: "≥ 45%",
		},
		ltcr: {
			elite: "> 90%",
			high: "70%-90% (70% included)",
			medium: "40%-70% (40% included)",
			low: "< 40%",
		},
	},
	Monthly: {
		df: {
			elite: "> 30 times",
			high: "4-30 times (30 included)",
			medium: "1-4 times (4 included)",
			low: "≤ 1 time",
		},
		lt: {
			elite: "< 1 day",
			high: "1-7 days (1 included)",
			medium: "7-30 days (7 included)",
			low: "≥ 30 days",
		},
		mttr: {
			elite: "< 1 hour",
			high: "1-24 hours (1 included)",
			medium: "24-168 hours (24 included)",
			low: "≥ 168 hours",
		},
		cfr: {
			elite: "< 15%",
			high: "15%-30% (15 included)",
			medium: "30%-45% (30% included)",
			low: "≥ 45%",
		},
		ltcr: {
			elite: "> 90%",
			high: "70%-90% (70% included)",
			medium: "40%-70% (40% included)",
			low: "< 40%",
		},
	},
};
