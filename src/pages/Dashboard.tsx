import CurrentWeather from "@/components/CurrentWeather";
import FavouriteCities from "@/components/FavouriteCities";
import HourlyTemprature from "@/components/HourlyTemprature";
import WeatherSkeleton from "@/components/LoadingSkeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button"
import WeatherDetails from "@/components/WeatherDetails";
import WeatherForecast from "@/components/WeatherForecast";
import { useGeolocation } from "@/hooks/useGeolocation"
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from "@/hooks/useWeather";
import { AlertTriangle, MapPin, MapPinOff, RefreshCw } from "lucide-react"

const Dashboard = () => {
  const { coordinates, error: locationError, isLoading: locationLoading, getLocation } = useGeolocation();
  const locationQuery = useReverseGeocodeQuery(coordinates);
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  const handleRefresh = () => {
    getLocation();
    if(coordinates){
      locationQuery.refetch();
      weatherQuery.refetch();
      forecastQuery.refetch();

    }
  }

  if(locationLoading){
    return <WeatherSkeleton /> 
  }
  if (locationError) {
    return <Alert variant="destructive">
      <MapPinOff />
      <AlertTitle>Location Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>{locationError}</p>
        <Button onClick={getLocation}
          variant={"outline"} className="w-fit">
          <MapPin className="mr-2 h-4 w-4 " />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  }
  if (!coordinates) {
    return <Alert variant="destructive">
      <MapPinOff />
      <AlertTitle>Location Required</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Please enable location access to see your local weather</p>
        <Button onClick={getLocation}
          variant={"outline"} className="w-fit">
          <MapPin className="mr-2 h-4 w-4 " />
          Enable Location
        </Button>
      </AlertDescription>
    </Alert>
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4"/>
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <p>Failed to fetch weather data. Please try again</p>
        <Button onClick={handleRefresh}
          variant={"outline"} className="w-fit">
          <RefreshCw className="mr-2 h-4 w-4 " />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  }
  if(!weatherQuery.data || !forecastQuery.data){
    return <WeatherSkeleton />
  }


  return (
    <div className="space-y-4">

      {/* Favorite Cities */}
      <FavouriteCities />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button variant={"outline"}
        size={"icon"}
        onClick={handleRefresh}
        disabled={ weatherQuery.isFetching || forecastQuery.isFetching }
        className="cursor-pointer"
        >
          <RefreshCw className={`h-4 w-4 ${ weatherQuery.isFetching || forecastQuery.isFetching ? "animate-spin" : "" }`} />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Current Weather */}
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />

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

export default Dashboard