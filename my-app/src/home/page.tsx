import React from "react";
import Button from "@mui/material/Button";
import { Search } from "lucide-react";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CustomizedHook from "../components/tag";
import { Divider } from "@mui/material";
import { supabase } from "../database/supabase";
import { useNavigate } from "react-router";

interface ImageData {
  src: string;
  alt: string;
  label: string;
}

export default function Home() {
  const navigate = useNavigate();
  const [selectHotel, setSelectHotel] = React.useState<string>("");
  const [selectTag, setSelectTag] = React.useState<
    {
      label: string;
      id: number;
    }[]
  >([]);

  const [hotel, setHotel] = React.useState<
    {
      name: string;
    }[]
  >([]);

  React.useEffect(() => {
    // Define the async function
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("distinct_name").select();
        console.log(data);
        setHotel(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="relative">
        <p className="w-full text-center text-8xl font-semibold text-white capitalize absolute z-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          not just a stay, a story
        </p>
        <div className="w-full bottom-0 absolute z-10 -mb-20 ">
          <div className="flex-col flex px-14 py-6 bottom-0 bg-white mx-14 rounded-2xl shadow-md gap-4">
            <div className="flex items-end gap-4">
              <Autocomplete
                className="flex-1"
                id="free-solo-demo"
                freeSolo
                options={hotel.map((option) => option.name)}
                renderInput={(params) => (
                  <TextField {...params} label="Hotels" />
                )}
                onChange={(e, value) => setSelectHotel(!value ? "" : value)}
              />
              <Divider orientation="vertical" flexItem />
              <CustomizedHook setSelectTag={setSelectTag} />
            </div>
            <Button
              variant="contained"
              sx={{
                width: "full",
                paddingY: "10px",
                color: "white",
              }}
              onClick={() => {
                console.log(selectTag);
                let labelString = "";
                selectTag.forEach((item) => {
                  labelString += item.label + "_";
                });
                navigate(`/search?hotel=${selectHotel}&tags=${labelString}`);
              }}
            >
              <span className="capitalize text-xl flex items-center gap-2 ">
                <Search className="w-5 h-5" strokeWidth={3} />
                Search
              </span>
            </Button>
          </div>
        </div>
        <img
          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/26/4e/dc/a3/new-world-phu-quoc-resort.jpg?w=1200&h=-1&s=1"
          className="h-[735px] w-full brightness-50"
        />
      </div>
      <div className="w-full px-14 pt-32">
        <p className="text-5xl font-semibold mb-20">Popular Places</p>
        <div className="grid grid-cols-4 gap-6 mb-24">
          {imageData.map((item, index) => {
            return <ImageItem key={index} item={item} />;
          })}
        </div>
      </div>
    </>
  );
}

function ImageItem({ item }: { item: ImageData }) {
  return (
    <div className="relative">
      <img
        src={item.src}
        alt={item.alt}
        className="object-cover object-center brightness-100h h-[440px] rounded-xl brightness-90"
      />
      <div className="flex absolute flex-col gap-5 bottom-7 left-0 w-full px-6">
        <p className="text-white font-semibold text-3xl ">{item.label}</p>
        <Button
          variant="contained"
          sx={{
            width: "full",
            paddingY: "10px",
            color: "white",
          }}
        >
          <span className="normal-case">Find a Hotel</span>
        </Button>
      </div>
    </div>
  );
}

const imageData: ImageData[] = [
  {
    src: "https://vcdn1-dulich.vnecdn.net/2022/07/18/ha-long-quang-ninh-jpeg-9862-1-1398-8445-1658113194.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=v3wvlCTR82KxbKRSn500dw",
    alt: "f-1",
    label: "Ha Long",
  },
  {
    src: "https://ik.imagekit.io/tvlk/blog/2023/05/vuon-quoc-gia-phong-nha-ke-bang-6-1024x682.jpg?tr=dpr-2,w-675",
    alt: "f-2",
    label: "Phong Nha",
  },
  {
    src: "https://www.tripsavvy.com/thmb/-nPVciXf7-kl-XrW096N_9c-_IA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ho-chi-minh-city-at-night-22c7df816ce4493eb0e86cf54fe03309.jpg",
    alt: "f-3",
    label: "Ho Chi Minh city",
  },
  {
    src: "https://vietnam.travel/sites/default/files/2022-11/shutterstock_1343287187.jpg",
    alt: "f-4",
    label: "Ba Na",
  },
];

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  {
    title:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  {
    title: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];
