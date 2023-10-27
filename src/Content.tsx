import * as React from "react";
import {
	init,
	useFocusable,
	FocusContext,
	FocusDetails,
	FocusableComponentLayout,
	KeyPressDetails
} from "@noriginmedia/norigin-spatial-navigation";
import { result, shuffle } from "lodash";
import styled from "styled-components";

import { getMovies, getMovieGenres, getMoviesByGenre } from "./api/api";

init({
	debug: false,
	visualDebug: false
});

// INTERFACES
interface Genre {
	id: number;
	name: string;
}

interface MovieOrTvShow {
	id: number;
	title: string;
	color: string;
	poster_path: string;
	release_date: string;
	overview: string;
	genre_ids: number[];
}

interface MovieOrTvShowWithGenres extends MovieOrTvShow {
	genre_names: string[];
}

interface IAsset {
	title: string;
	posterUrl: string;
	releaseDate: string;
	genres: string;
	overview: string;
}

interface AssetBoxProps {
	focused: boolean;
	posterUrl: string;
}

interface AssetTitleProps {
	focused: boolean;
}

interface AssetProps {
	title: string;
	posterUrl: string;
	releaseDate: string;
	genres: string;
	overview: string;
	onEnterPress: (props: object, details: KeyPressDetails) => void;
	onFocus: (
		layout: FocusableComponentLayout,
		props: object,
		details: FocusDetails
	) => void;
}

interface ContentRowProps {
	title: string;
	recommendedCount?: number;
	allMoviesCount?: number;
	selectedGenre: string;
	onAssetPress: (props: object, details: KeyPressDetails) => void;
	onFocus: (
		layout: FocusableComponentLayout,
		props: object,
		details: FocusDetails
	) => void;
}

interface ContentProps {
	selectedGenre: string;
}

// STYLED COMPONENTS DEFINITIONS
const AssetWrapper = styled.div`
  margin-right: 22px;
  padding-right: 10px;
  display: flex;
  flex-direction: column;
`;

const AssetBox = styled.div<AssetBoxProps>`
  width: 225px;
  height: 300px;
  background-image: url(${(props) => props.posterUrl});
  background-size: cover;
  background-position: center;
  border-color: red;
  border-style: solid;
  transition: 0.3s all ease-in-out;
  border-width: ${({ focused }) => (focused ? "6px" : 0)};
  filter: ${({ focused }) => (focused ? "drop-shadow(5px 5px 10px #000000)" : "none")};
  box-sizing: border-box;
  border-radius: 7px;
`;

const AssetTitle = styled.div<AssetTitleProps>`
  color: white;
  font-family: "Satoshi", sans-serif;
  font-size: 24px;
  transition: 0.3s all ease-in-out;
  text-align: ${({ focused }) => (focused ? "center" : "left")};
  font-weight: ${({ focused }) => (focused ? "bold" : "400")};
  border-bottom: ${({ focused }) => (focused ? "2px solid white" : "0")}
`;

const AssetReleaseDate = styled.div`
    color: white;
    margin: 10px 0;
`;

const AssetGenres = styled.div`
  color: white;
  font-weight: 400;
  margin: 10px 0;
`;

const ContentRowWrapper = styled.div`
  margin-bottom: 37px;
`;

const ContentRowTitle = styled.div`
  color: white;
  margin-bottom: 22px;
  font-size: 27px;
  font-weight: 700;
  font-family: "Segoe UI";
  padding-left: 60px;
`;

const ContentRowScrollingWrapper = styled.div`
  overflow-x: auto;
  overflow-y: hidden;
  flex-shrink: 1;
  flex-grow: 1;
  padding-left: 60px;
`;

const ContentRowScrollingContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ContentWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ContentTitle = styled.div`
  color: white;
  font-size: 36px;
  font-weight: 600;
  font-family: "Satoshi", sans-serif;
  text-align: center;
  margin-top: 52px;
  margin-bottom: 37px;
`;

const SelectedItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
`;

const SelectedItemBox = styled.div`
  height: 400px;
  width: 1080px;
  /*background-color: ${({ color }) => color};*/
  background-image: url(${(props) => props.color});
  background-size: cover;
  border-radius: 7px;
`;

const SelectedItemTitle = styled.div`
  /*position: relative;
  bottom: 75px;
  left: 100px;*/
  position:absolute;
  bottom: 0;
  color: white;
  font-size: 27px;
  font-weight: 400;
  font-family: "Satoshi", sans-serif;
`;

const ScrollingRows = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 1;
  flex-grow: 1;
`;

const ButtonsContainers = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px
`;

const PlayButton = styled.button`
    margin-right: 20px;
    padding: 10px 30px;
    font-weight: bold;
    border-radius: 50px;
    border: 0;
    background: red;
    color: white;
    filter: drop-shadow(5px 5px 10px #000000);
    cursor: pointer;
`;

const WatchLaterButton = styled.button`
    margin-right: 20px;
    padding: 10px 30px;
    font-weight: bold;
    border-radius: 50px;
    border: 0;
    background: blue;
    color: white;
    filter: drop-shadow(5px 5px 10px #000000);
    cursor: pointer;
`;

const FavouriteButton = styled.button`
    margin-right: 20px;
    padding: 10px 30px;
    font-weight: bold;
    border-radius: 50px;
    border: 0;
    background: green;
    color: white;
    filter: drop-shadow(5px 5px 10px #000000);
    cursor: pointer;
`;

// METHODS ON CONST AND FUNCS

// CONSTS
// SHUFFLE THE ROWS WITH IT'S TITLES
const rows = shuffle([
	{
		title: "Recommended"
	},
	{
		title: "All the Movies"
	},
]);

// HANDLER TO FIND THE GENRE ID BASED ON THE NAME
const findGenreIds = (genreName: string, genreList: { id: number, name: string }[]) => {
	if (!Array.isArray(genreList)) {
		console.log('Genre list is not an array');
		return null;
	}

	const selectedGenre = genreList.find((genre) => genre.name === genreName);
	if (selectedGenre) {
		return selectedGenre.id;
	}
	return null;
}

// FUNCS
// METHOD TO MAP THE GENRES PASSING THE GENRES ID'S AND THE FULL ARRAY AND RETURNS THE ARRAY WITH THE GENRES NAMES 
function genreMapping(movieOrTvGenres: { genres: Genre[] }, movieOrTvArray: { results: MovieOrTvShow[] }): MovieOrTvShowWithGenres[] {
	const genreMap: Record<number, string> = {};
	movieOrTvGenres.genres.forEach((genre) => {
		genreMap[genre.id] = genre.name;
	});

	const resultWithGenres: MovieOrTvShowWithGenres[] = movieOrTvArray.results.map((tv) => {
		const genreNames = tv.genre_ids.map((genreId) => genreMap[genreId]);
		return {
			...tv,
			genre_names: genreNames,
		};
	});

	const resultShuffled = shuffle(resultWithGenres)
	// console.log(resultShuffled)

	return resultShuffled;
}

function Asset({ title, posterUrl, releaseDate, genres, overview, onEnterPress, onFocus, }: AssetProps) {
	const { ref, focused } = useFocusable({
		onEnterPress,
		onFocus,
		extraProps: {
			title,
			posterUrl,
			releaseDate,
			genres,
			overview
		}
	});

	return (
		<AssetWrapper ref={ref}>
			<AssetBox posterUrl={`https://www.themoviedb.org/t/p/w220_and_h330_face${posterUrl}`} focused={focused} />
			<AssetReleaseDate>Release Date: <span style={{ fontWeight: 'bold' }}>{new Date(releaseDate).toLocaleDateString()}</span></AssetReleaseDate>
			<AssetTitle focused={focused}>{title}</AssetTitle>
			<AssetGenres>Genres: <span style={{ fontWeight: 'bold' }}>{genres}</span></AssetGenres>
		</AssetWrapper>
	);
}

function ContentRow({
	title: rowTitle,
	onAssetPress,
	onFocus,
	recommendedCount = 20, // Default to 20 for recommendedCount
	allMoviesCount = 100, // Default to 100 for allMoviesCount
	selectedGenre,
}: ContentRowProps) {

	const [moviesWithGenres, setMoviesWithGenres] = React.useState<MovieOrTvShowWithGenres[]>([]);

	React.useEffect(() => {
		async function fetchData() {

			// First request is the genres of the movies for the case that I need the response ready to go to the other methods
			const requestMovieGenres = await getMovieGenres();

			// Asign the genres list
			const resultMovieGenres = await requestMovieGenres;

			//Check if selected genre is all or if is an specific genrer, if so, enters the else to search the assets from that specific genre
			if (selectedGenre === 'All Genres') {
				const [requestMovies1, requestMovies2, requestMovies3, requestMovies4, requestMovies5] = await Promise.all([getMovies(1), getMovies(2), getMovies(3), getMovies(4), getMovies(5)]);

				const movieDBResults = [
					requestMovies1,
					requestMovies2,
					requestMovies3,
					requestMovies4,
					requestMovies5,
				];

				// Map the arrays with the func and returns items
				const moviesWithGenresDataArray = movieDBResults.map((resultMovieDB) =>
					genreMapping(resultMovieGenres, resultMovieDB)
				);

				// Combine all the arrays into one
				const allMoviesWithGenres = moviesWithGenresDataArray.reduce((acc, currentArray) => acc.concat(currentArray), []);

				setMoviesWithGenres(allMoviesWithGenres);
			} else {
				const genreId = findGenreIds(selectedGenre, resultMovieGenres.genres);
				// console.log(genreId)
				if (genreId !== null) {
					const [requestMovies1, requestMovies2, requestMovies3, requestMovies4, requestMovies5] = await Promise.all([
						getMoviesByGenre(genreId, 1),
						getMoviesByGenre(genreId, 2),
						getMoviesByGenre(genreId, 3),
						getMoviesByGenre(genreId, 4),
						getMoviesByGenre(genreId, 5)
					]);

					const movieDBResults = [
						requestMovies1,
						requestMovies2,
						requestMovies3,
						requestMovies4,
						requestMovies5,
					];

					// Map the arrays with the func and returns items
					const moviesWithGenresDataArray = movieDBResults.map((resultMovieDB) =>
						genreMapping(resultMovieGenres, resultMovieDB)
					);

					// Combine all the arrays into one
					const allMoviesWithGenres = moviesWithGenresDataArray.reduce((acc, currentArray) => acc.concat(currentArray), []);

					setMoviesWithGenres(allMoviesWithGenres);
				}
			}
		}

		fetchData();
	}, [selectedGenre]);

	const { ref, focusKey } = useFocusable({
		onFocus
	});

	const scrollingRef = React.useRef<HTMLDivElement>(null);

	const onAssetFocus = React.useCallback(
		({ x }: { x: number }) => {
			scrollingRef.current?.scrollTo({
				left: x,
				behavior: "smooth"
			});
		},
		[]
	);

	return (
		<FocusContext.Provider value={focusKey}>
			<ContentRowWrapper ref={ref}>
				<ContentRowTitle>{rowTitle}</ContentRowTitle>
				<ContentRowScrollingWrapper ref={scrollingRef}>
					<ContentRowScrollingContent>
						{moviesWithGenres.map((movie, index) => (
							<Asset
								key={`${movie.id}-${rowTitle}-${index}`}
								title={movie.title}
								posterUrl={movie.poster_path}
								releaseDate={movie.release_date}
								genres={movie.genre_names.join(', ')}
								overview={movie.overview}
								onEnterPress={onAssetPress}
								onFocus={onAssetFocus}
							/>
						)).slice(0, rowTitle === "Recommended" ? recommendedCount : allMoviesCount)}
					</ContentRowScrollingContent>
				</ContentRowScrollingWrapper>
			</ContentRowWrapper>
		</FocusContext.Provider>
	);
}

// HERE WE RENDER THE FINAL CONTENT
export function Content({ selectedGenre }: ContentProps) {
	const { ref, focusKey, focusSelf } = useFocusable();

	const [selectedAsset, setSelectedAsset] = React.useState<IAsset | null>(null);
	const [userSelectsAsset, setUserSelectsAsset] = React.useState(false)

	const onAssetPress = React.useCallback((asset: IAsset) => {
		setSelectedAsset(asset);
		setUserSelectsAsset(true)
	}, []);

	const onRowFocus = React.useCallback(
		({ y }: { y: number }) => {
			ref.current.scrollTo({
				top: y,
				behavior: "smooth"
			});
		},
		[ref]
	);

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Backspace") {
			setUserSelectsAsset(false);
		}
	};


	React.useEffect(() => {
		focusSelf()
	}, [focusSelf])

	// Add the event listener for "Backspace" key
	React.useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);

		// Clean up the event listener when the component unmounts
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<FocusContext.Provider value={focusKey}>
			<ContentWrapper>
				<ContentTitle>React Movie Demo App</ContentTitle>
				{
					(userSelectsAsset) ?
						<SelectedItemWrapper>
							<SelectedItemBox
								color={selectedAsset ? `https://www.themoviedb.org/t/p/w1280_and_h720_face${selectedAsset.posterUrl}` : "background-color: #565b6b"}
							>
								{
									(selectedAsset) ?
										<div style={{ display: "flex", backgroundColor: "rgba(0,0,0,0.3)", width: "95%", maxHeight: "350px", padding: "10px", borderRadius: "5px", margin: "10px" }}>
											<img src={`https://www.themoviedb.org/t/p/w220_and_h330_face${selectedAsset.posterUrl}`} alt="" style={{ margin: "10px", borderRadius: "5px" }} />
											<div style={{ flex: 1, padding: "10px", color: "white" }}>
												<h4 style={{ fontSize: "24px", margin: 0 }}>{selectedAsset.title}</h4>
												<h6 style={{ fontSize: "16px", margin: "5px 0" }}>Release Date: {new Date(selectedAsset.releaseDate).toLocaleDateString()}</h6>
												<h6 style={{ fontSize: "16px", margin: "5px 0" }}>Genres: {selectedAsset.genres}</h6>
												<h5 style={{ fontSize: "14px", margin: 0 }}>{selectedAsset.overview}</h5>
												<ButtonsContainers>
													<PlayButton>Play now</PlayButton>
													<WatchLaterButton>Add to Watch Later</WatchLaterButton>
													<FavouriteButton>Add to Favourites</FavouriteButton>
												</ButtonsContainers>
											</div>
										</div>
										:
										null
								}
							</SelectedItemBox>
						</SelectedItemWrapper>
						: null
				}

				<ScrollingRows ref={ref}>
					<div>
						{rows.map(({ title }) => (
							<ContentRow
								key={title}
								title={title}
								recommendedCount={title === "Recommended" ? 20 : undefined}
								allMoviesCount={title === "All the Movies" ? 100 : undefined}
								selectedGenre={selectedGenre}
								onAssetPress={(props, details) => onAssetPress(props as IAsset)}
								onFocus={onRowFocus}
							/>
						))}
					</div>
				</ScrollingRows>
			</ContentWrapper>
		</FocusContext.Provider>
	);
}
