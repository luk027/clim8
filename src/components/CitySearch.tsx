import { useState } from "react";
import { Button } from "./ui/button"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command"
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/useWeather";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { format } from "date-fns";
import { useFavorites } from "@/hooks/useFavorite";

const CitySearch = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    const { favorites } = useFavorites();
    const { data: locations, isLoading } = useLocationSearch(query);
    const { history, addToHistory, clearHistory } = useSearchHistory();
    const handleSelect = async (cityData: string) => {
        const [lat, lon, name, country] = cityData.split(" | ");

        //Add to search history
        addToHistory.mutate({
            query,
            name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            country,
        });

        setOpen(false);
        navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
    }
    return (
        <>

            <Button
                variant={"outline"}
                className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                onClick={() => setOpen(true)}>
                <Search className="mr-2 h-4 w-4" />
                Search cities...
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Search cities..."
                    value={query}
                    onValueChange={(value) => setQuery(value)}
                />
                <CommandList>
                    {query.length > 2 && !isLoading && <CommandEmpty>No cities found.</CommandEmpty>}
                    {
                        favorites.length > 0 && (
                                <CommandGroup heading="Favorites">
                                    {
                                        favorites.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={`${item.lat} | ${item.lon} | ${item.name} | ${item.country}`}
                                                onSelect={handleSelect}
                                            >
                                                <Star className="mr-2 h-4 w-4 text-yellow-500" />
                                                <span>
                                                    {item.name}
                                                    {
                                                        item.state && (
                                                            <span className="text-sm text-muted-foreground">
                                                                , {item.state}
                                                            </span>
                                                        )
                                                    }
                                                    <span className="text-sm text-muted-foreground">
                                                        , {item.country}
                                                    </span>
                                                </span>
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>
                        )
                    }
                    {
                        history.length > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <div className="flex items-center justify-between px-2 my-2">
                                        <p className="text-sm text-muted-foreground">Recent Searches</p>
                                        <Button
                                        variant={"ghost"}
                                        size={"sm"}
                                        onClick={() => clearHistory.mutate()}>
                                            <XCircle className="h=4 w-4" />
                                        </Button>
                                    </div>
                                    {
                                        history.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={`${item.lat} | ${item.lon} | ${item.name} | ${item.country}`}
                                                onSelect={handleSelect}
                                            >
                                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {item.name}
                                                    {
                                                        item.state && (
                                                            <span className="text-sm text-muted-foreground">
                                                                , {item.state}
                                                            </span>
                                                        )
                                                    }
                                                    <span className="text-sm text-muted-foreground">
                                                        , {item.country}
                                                    </span>
                                                </span>
                                                <span className="ml-auto text-sm text-muted-foreground">
                                                    { format(item.searchedAt, "MMM d, h:mm a") }
                                                </span>
                                            </CommandItem>
                                        ))
                                    }
                                </CommandGroup>
                            </>
                        )
                    }

                    <CommandSeparator />
                    {
                        locations && locations.length > 0 && (
                            <CommandGroup heading="Suggestions">
                                {
                                    isLoading && (
                                        <div className="flex items-center justify-center p-4">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    )
                                }
                                {locations.map((location) => (
                                        <CommandItem
                                            key={`${location.lat}-${location.lon}`}
                                            value={`${location.lat} | ${location.lon} | ${location.name} | ${location.country}`}
                                            onSelect={handleSelect}
                                        >
                                            <Search className="mr-2 h-4 w-4" />
                                            <span>
                                                {location.name}
                                                {
                                                    location.state && (
                                                        <span className="">
                                                            , {location.state}
                                                        </span>
                                                    )
                                                }
                                                <span className="text-sm text-muted-foreground">
                                                    , {location.country}
                                                </span>
                                            </span>
                                        </CommandItem>
                                ))}
                            </CommandGroup>
                        )
                    }
                    <CommandSeparator />

                </CommandList>
            </CommandDialog>
        </>
    )
}

export default CitySearch