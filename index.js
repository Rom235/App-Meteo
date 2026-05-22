const cityInput = document.getElementById("city");
const getWeatherButton = document.getElementById("getWeather");
const weatherResult = document.getElementById("weatherResult");

// Correspondance entre les codes météo Open-Meteo et leur libellé en français.
const weatherLabels = {
	0: "Ciel dégagé",
	1: "Plutôt clair",
	2: "Partiellement nuageux",
	3: "Couvert",
	45: "Brouillard",
	48: "Brouillard givrant",
	51: "Bruine faible",
	53: "Bruine modérée",
	55: "Bruine dense",
	61: "Pluie faible",
	63: "Pluie modérée",
	65: "Pluie forte",
	71: "Neige faible",
	73: "Neige modérée",
	75: "Neige forte",
	80: "Averses faibles",
	81: "Averses modérées",
	82: "Averses fortes",
	95: "Orage",
	96: "Orage avec grêle faible",
	99: "Orage avec grêle forte",
};

// Réutilise la même table pour les prévisions horaires.
const hourlyWeatherLabels = weatherLabels;

// Affiche un message simple, utile pour le chargement et les erreurs.
function renderMessage(message, isError = false) {
	weatherResult.textContent = message;
	weatherResult.classList.toggle("is-error", isError);
}

// Affiche la météo courante de la ville recherchée.
function renderWeather(cityName, temperature, windSpeed, weatherCode) {
	const label = weatherLabels[weatherCode] || "Conditions inconnues";
	weatherResult.classList.remove("is-error");
	weatherResult.innerHTML = `
		<h2>Météo à ${cityName}</h2>
		<p><strong>${Math.round(temperature)}°C</strong> — ${label}</p>
		<p>Vent: ${Math.round(windSpeed)} km/h</p>
	`;
}

// Génère les cartes des prochaines heures avec température, état du ciel et pluie.
function renderHourlyForecast(hourlyData) {
	const now = new Date();
	const nextHours = hourlyData.time
		.map((time, index) => ({
			time: new Date(time),
			temperature: hourlyData.temperature_2m[index],
			weatherCode: hourlyData.weather_code[index],
			precipitationProbability: hourlyData.precipitation_probability[index],
		}))
		.filter((entry) => entry.time >= now)
		.slice(0, 6);

	if (nextHours.length === 0) {
		return "";
	}

	return `
		<div class="hourly-forecast">
			<h3>Prochaines heures</h3>
			<div class="hourly-grid">
				${nextHours
					.map((entry) => {
						const timeLabel = entry.time.toLocaleTimeString("fr-FR", {
							hour: "2-digit",
							minute: "2-digit",
						});
						const label = hourlyWeatherLabels[entry.weatherCode] || "Conditions inconnues";

						return `
							<article class="hour-card">
								<span class="hour-time">${timeLabel}</span>
								<strong class="hour-temp">${Math.round(entry.temperature)}°C</strong>
								<span class="hour-label">${label}</span>
								<span class="hour-rain">Pluie: ${Math.round(entry.precipitationProbability ?? 0)}%</span>
							</article>
						`;
					})
					.join("")}
			</div>
		</div>
	`;
}

// Récupère la ville, puis ses coordonnées, puis ses données météo.
async function fetchWeatherForCity() {
	const city = cityInput.value.trim();

	if (!city) {
		renderMessage("Entre une ville pour afficher la météo.", true);
		return;
	}

	renderMessage("Recherche de la ville en cours...");
	getWeatherButton.disabled = true;

	try {
		// 1) On cherche les coordonnées de la ville.
		const geocodingResponse = await fetch(
			`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`
		);

		if (!geocodingResponse.ok) {
			throw new Error("Impossible de récupérer les coordonnées de la ville.");
		}

		const geocodingData = await geocodingResponse.json();

		if (!geocodingData.results || geocodingData.results.length === 0) {
			renderMessage(`Aucune ville trouvée pour "${city}".`, true);
			return;
		}

		const place = geocodingData.results[0];
		renderMessage(`Météo en cours pour ${place.name}...`);

		// 2) On récupère la météo actuelle et les prévisions horaires.
		const weatherResponse = await fetch(
			`https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code,precipitation_probability&timezone=auto`
		);

		if (!weatherResponse.ok) {
			throw new Error("Impossible de récupérer la météo.");
		}

		const weatherData = await weatherResponse.json();

		if (!weatherData.current) {
			throw new Error("Aucune donnée météo disponible.");
		}

		renderWeather(
			`${place.name}${place.admin1 ? `, ${place.admin1}` : ""}${place.country ? `, ${place.country}` : ""}`,
			weatherData.current.temperature_2m,
			weatherData.current.wind_speed_10m,
			weatherData.current.weather_code
		);
		weatherResult.insertAdjacentHTML("beforeend", renderHourlyForecast(weatherData.hourly));
	} catch (error) {
		renderMessage(error.message || "Une erreur est survenue.", true);
	} finally {
		getWeatherButton.disabled = false;
	}
}

// Le bouton lance la recherche météo.
getWeatherButton.addEventListener("click", fetchWeatherForCity);

// La touche Entrée déclenche aussi la recherche.
cityInput.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		fetchWeatherForCity();
	}
});
