import type { WeatherData } from "@/api/types"
import { useFavorites } from "@/hooks/useFavorite";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavouriteButtonProps {
    data: WeatherData; 
}

const FavouriteButton = ({data}: FavouriteButtonProps) => {
    const { addFavorite, isFavorite, removeFavorite } = useFavorites();
    const iscurrentlyFavorite = isFavorite(data.coord.lat, data.coord.lon);

    const handleToggeleFavorite = () => {
        if(iscurrentlyFavorite) {
            removeFavorite.mutate(`${data.coord.lat}-${data.coord.lon}`);
            toast.error(`Removed ${data.name} from Favorites`);
        }else{
            addFavorite.mutate({
                name: data.name,
                lat: data.coord.lat,
                lon: data.coord.lon,
                country: data.sys.country,                                                      
            });
            toast.success(`Added ${data.name} to Favorites`);
        }
    }

  return (
    <Button variant={iscurrentlyFavorite ? 'default' : 'outline'}
    size={'icon'} onClick={handleToggeleFavorite}
    className={iscurrentlyFavorite ? 'bg-yellow-500 hover:bg-yellow-600' : ''}>
        <Star className={` h-4 w-4 ${iscurrentlyFavorite ? 'fill-current' : ''}`}/>
    </Button>
  )
}

export default FavouriteButton