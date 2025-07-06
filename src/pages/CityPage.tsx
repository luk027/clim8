import CurrentWeather from "@/components/CurrentWeather";
import FavouriteButton from "@/components/FavouriteButton";
import HourlyTemprature from "@/components/HourlyTemprature";
import WeatherSkeleton from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useForecastQuery, useWeatherQuery } from "@/hooks/useWeather";
import { AlertTriangle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom"

const CityPage = () => {
  const [ searchParams ] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");
  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  if (weatherQuery.error || forecastQuery.error) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4"/>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again</p>
      </AlertDescription>
    </Alert>
  }
  if(!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />
  }

  return (
    <div className="space-y-4">

      {/* Favorite Cities */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{params.cityName}, {weatherQuery.data.sys.country}</h1>
        {/* Favourite */}
        <div>
          <FavouriteButton data={{...weatherQuery.data, name: params.cityName}} />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          {/* Current Weather */}
          <CurrentWeather data={weatherQuery.data} />

          {/* Hourly Temprature */}
          <HourlyTemprature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* Details */}
          <WeatherDetails data={weatherQuery.data}/>

          {/* Forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>

    </div>
  )
}

export default CityPage