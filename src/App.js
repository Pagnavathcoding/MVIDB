import React from 'react';
import { useEffect, useState, Component } from 'react';
import "./index.css";
import notFoundImage from './Images/not-found.png';
import play from './Images/play.svg';
import prev from './Images/prev.svg';
import next from './Images/next.svg';
const image = 'https://image.tmdb.org/t/p/w500';
const video = 'https://www.youtube.com/embed/';
function Movie({ infos }) {
    const [toggle, setToggle] = useState(false);
    const [show, setShow] = useState(false);
    const [movie, setMovie] = useState([]);
    class LinkedList {
        constructor(data) {
            this.data = data;
        }
    }
    const data = new LinkedList(infos);
    useEffect(() => {
        async function video(id) {
            const res = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=723c849121d214ebd66ccfd0fb6bbb31&language=en-US`);
            return res.json().then((data) => {
                setMovie(data.results);
            }).catch((err) => {
                return err;
            })
        }
        video(data.data.id);
    }, [])
    return (
        <div className="movie">
            <img src={image + data.data.backdrop_path === `${image}null` ? notFoundImage : image + data.data.backdrop_path} />
            <div className="title">
                <p>{data.data.original_title.length > 15 ? data.data.original_title.slice(0, 15) + "..." : data.data.original_title}</p>
                <p style={{ padding: "0.5em 0" }}>⭐ {data.data.vote_average}</p>
                <div className="btn">
                    <button onClick={() => {
                        setToggle(!toggle);
                    }}>Read More</button>
                    <button onClick={() => setShow(!show)}><img src={play} /></button>
                </div>
            </div>
            <div className="more" style={{ display: !toggle ? 'none' : 'flex' }}>
                <div className="item">
                    <div className="image">
                        <img src={image + data.data.backdrop_path === `${image}null` ? notFoundImage : image + data.data.backdrop_path} />
                        <p><span>Release date:</span> {data.data.release_date}</p>
                        <button onClick={() => setToggle(!toggle)}>Close</button>
                    </div>
                    <div className="content">
                        <h1>{data.data.original_title}</h1>
                        <p>{data.data.overview}</p>
                        <p><span>Language:</span> {data.data.original_language.toUpperCase()}</p>
                        <p><span>Popularity:</span> {data.data.popularity}</p>
                        <p><span>Voter:</span> {data.data.vote_count}</p>
                    </div>
                </div>
            </div>
            <div className="video" style={{ display: !show ? "none" : "flex" }}>
                <div className="title-video">
                    <h1>Video Trailer</h1>
                    <button onClick={() => setShow(!show)}>Close</button>
                </div>
                <div className="movie">
                    {
                        movie.map((data, index) => {
                            return <iframe src={video + data.key} key={index}></iframe>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
function App() {
    const [value, setValue] = useState('');
    const [enter, setEnter] = useState('');
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(0);
    const [data, setData] = useState([]);
    useEffect(() => {
        async function movies() {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=723c849121d214ebd66ccfd0fb6bbb31&language=en-US&page=${page}&include_adult=false&query=${enter || 'It'}`);
            return res.json().then((data) => {
                setData(data.results);
                setPages(data.total_pages);
                console.log(data.results)
            }).catch((err) => {
                console.log('Error' + err);
            })
        }
        movies();
    }, [enter, page]);
    function handleChange(e) {
        setValue(e.target.value);
    }
    function handleSubmit() {
        setPage(1);
        setEnter(value);
    }
    return (
        <main>
            <header>
                <div className="logo">
                    <h1>MVIDB</h1>
                </div>
                <div className="search">
                    <input type="text" placeholder="Search movie..." value={value} onChange={handleChange} onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            if (value === '') {
                                return;
                            }
                            else {
                                setPage(1);
                                setEnter(value);
                            }
                        }
                    }} />
                    <button onClick={handleSubmit}>Search</button>
                </div>
            </header>
            <section className="container">
                <div className="infos">
                    <p>Search: <span>{enter || 'It'}</span></p>
                    <p>Current page: <span>{page < 10 ? "0" + page : page}</span></p>
                    <p>Total pages: <span>{pages < 10 ? "0" + pages : pages}</span></p>
                </div>
                <div className="data">
                    {
                        data.map((data) => {
                            return <Movie infos={data} key={Math.random()} />
                        })
                    }
                </div>
            </section>
            <div className="prev-next">
                <button onClick={() => {
                    if (page <= 1) {
                        return;
                    }
                    else {
                        setPage(page - 1)
                    }
                }}><img src={prev} alt="prev" /> Prev</button>
                <p>{page < 10 ? "0" + page : page}/{pages}</p>
                <button onClick={() => {
                    if (page >= pages) {
                        return;
                    }
                    else {
                        setPage(page + 1)
                    }
                }}>Next <img src={next} alt="next" /></button>
            </div>
            <footer>
                <p>&copy; 2021 MVIDB | made by <a href="https://www.github.com/Pagnavathcoding">Pagnavath</a>, All rights reserved.</p>
            </footer>
        </main>
    )
}
export default App;