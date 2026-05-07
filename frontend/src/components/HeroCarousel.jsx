import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const banners = Array.from({length:9},(_, i) =>`/images/carousel/banner${i+1}.avif`);

function HeroCarousel(){
    const[current, setCurrent] = useState(0);

    useEffect(()=>{
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 3000);
        return () => clearInterval(timer);
    },[]);

    const prev =()=> setCurrent((prev) => (prev -1 + banners.length) % banners.length);
    const next =()=> setCurrent((prev) => (prev + 1) % banners.length);

    return(
        <div className="hero-carousel">
            <div className="hero-carousel-track" style={{transform: `translateX(-${current * 100}%)`}}>
                {banners.map((src, i) =>(
                    <div className="hero-carousel-slide" key={i}>
                        <img src={src} alt={`Banner ${i + 1}`} />
                    </div>
                ))}
            </div>

            <button className="hero-carousel-btn prev" onClick={prev}>
                <FiChevronLeft size={20}/>
            </button>
            <button className="hero-carousel-btn next" onClick={next}>
                <FiChevronRight size={20}/>
            </button>

            <div className="hero-carousel-dots">
                {banners.map((_,i)=>(
                    <button key={i} className={`hero-dot ${i === current ? "active" : ""}`} onClick={() => setCurrent(i)}/>
                ))}
            </div>
        </div>
    )
}

export default HeroCarousel