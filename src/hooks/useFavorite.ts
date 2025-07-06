import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "./useLocalStorage"

interface FavoriteCity {
    id: string;
    name: string;
    lat: number;
    lon: number;
    country: string;
    state?: string;
    addedAt: number;
}

export const useFavorites = () => {
    const [favorites, setFavorites] = useLocalStorage<FavoriteCity[]>("favorites", []);
    const queryClient = useQueryClient();

    const favoriteQuery = useQuery({
        queryKey: ["favorites"],
        queryFn: () => favorites,
        initialData: favorites,
        staleTime: Infinity,
    });

    const addFavorite = useMutation({
        mutationFn: async(city: Omit<FavoriteCity, "id" | "addedAt">) => {
            const newfavorite: FavoriteCity = {
                ...city,
                id: `${city.lat}-${city.lon}`, 
                addedAt: Date.now(),
            };

            const exists = favorites.some((fav) => fav.id ===newfavorite.id);
            if(exists) return favorites;

            const newfavorites = [ ...favorites, newfavorite].slice(0, 10);

            setFavorites(newfavorites);
            return favorites;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            });
        }
    })

    const removeFavorite = useMutation({
        mutationFn: async(cityId: string) => {
            const newfavorites = favorites.filter((city) => city.id !== cityId);
            setFavorites(newfavorites);
            return newfavorites; 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["favorites"]
            });
        }
    });

    return {
        favorites: favoriteQuery.data,
        addFavorite,
        removeFavorite,
        isFavorite: (lat: number, lon: number) => 
            favorites.some((city) => city.lat === lat && city.lon === lon),
    }
}