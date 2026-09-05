// A single lightweight SVG scene; its light responds to the reading ritual.
export default function CrystalBall({ active }: { active: boolean }) {
  return (
    <div className={`mileide-scene${active ? " mileide-scene--awake" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 480 390" fill="none" focusable="false">
        <defs>
          <radialGradient id="mileide-window"><stop stopColor="#30304e"/><stop offset="1" stopColor="#0c0e1c"/></radialGradient>
          <linearGradient id="mileide-curtain"><stop stopColor="#170d17"/><stop offset=".3" stopColor="#4e2037"/><stop offset=".52" stopColor="#25101f"/><stop offset=".75" stopColor="#602c42"/><stop offset="1" stopColor="#190e19"/></linearGradient>
          <linearGradient id="mileide-wood" x2="0" y2="1"><stop stopColor="#694233"/><stop offset=".15" stopColor="#39231e"/><stop offset="1" stopColor="#170f13"/></linearGradient>
          <linearGradient id="mileide-cloth" x1="100" y1="260" x2="360" y2="390" gradientUnits="userSpaceOnUse"><stop stopColor="#462139"/><stop offset=".5" stopColor="#25152b"/><stop offset="1" stopColor="#4a2236"/></linearGradient>
          <radialGradient id="mileide-halo"><stop stopColor="#bca8dc" stopOpacity=".25"/><stop offset="1" stopColor="#9b6bb6" stopOpacity="0"/></radialGradient>
          <radialGradient id="mileide-glass" cx=".38" cy=".26" r=".76"><stop stopColor="#ddd6ef" stopOpacity=".7"/><stop offset=".17" stopColor="#949bbe" stopOpacity=".45"/><stop offset=".52" stopColor="#45466d" stopOpacity=".75"/><stop offset=".8" stopColor="#22233e"/><stop offset=".97" stopColor="#a9a5c2" stopOpacity=".65"/><stop offset="1" stopColor="#efe1d3" stopOpacity=".5"/></radialGradient>
          <radialGradient id="mileide-mist"><stop stopColor="#d6c2ea" stopOpacity=".7"/><stop offset=".55" stopColor="#a6a7db" stopOpacity=".16"/><stop offset="1" stopColor="#aca0d5" stopOpacity="0"/></radialGradient>
          <linearGradient id="mileide-brass"><stop stopColor="#4f3022"/><stop offset=".32" stopColor="#a78047"/><stop offset=".5" stopColor="#e1bd77"/><stop offset=".73" stopColor="#715031"/><stop offset="1" stopColor="#34251f"/></linearGradient>
          <linearGradient id="mileide-wax"><stop stopColor="#8d725b"/><stop offset=".45" stopColor="#f0d5a0"/><stop offset="1" stopColor="#9b7855"/></linearGradient>
          <radialGradient id="mileide-candlelight"><stop stopColor="#ffc975" stopOpacity=".28"/><stop offset="1" stopColor="#ed9147" stopOpacity="0"/></radialGradient>
          <linearGradient id="mileide-flame" x2="0" y2="1"><stop stopColor="#f4a445"/><stop offset=".6" stopColor="#ffda87"/><stop offset="1" stopColor="#fff4c5"/></linearGradient>
          <linearGradient id="mileide-quartz"><stop stopColor="#d6c8e4"/><stop offset=".48" stopColor="#9777b8"/><stop offset="1" stopColor="#35203f"/></linearGradient>
          <clipPath id="mileide-orbclip"><circle cx="240" cy="219" r="78"/></clipPath>
        </defs>
        <path d="M112 290V130a128 128 0 0 1 256 0v160" fill="url(#mileide-window)" stroke="#92734a" strokeOpacity=".5" strokeWidth="2"/>
        <path d="M127 279V132a113 113 0 0 1 226 0v147M240 17v105M132 129h216" stroke="#bd935b" strokeOpacity=".18"/>
        <path d="M271 51a23 23 0 1 0 23 31 26 26 0 0 1-23-31Z" fill="#e8d6a5" opacity=".8"/>
        <g fill="#ead8b4" opacity=".65">
          {[[168,91],[213,56],[301,109],[324,152],[151,177],[208,136],[292,160],[185,210],[322,231]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r={i%3===0?1.5:.8}/>)}
        </g>
        <path d="M0 0H139C134 115 122 184 53 219L32 291H0Z" fill="url(#mileide-curtain)"/>
        <path d="M480 0H341C346 115 358 184 427 219L448 291H480Z" fill="url(#mileide-curtain)"/>
        <g stroke="#ae7651" strokeOpacity=".22"><path d="M112 0C114 97 83 190 41 220M83 0C90 102 59 186 26 215M368 0C366 97 397 190 439 220M397 0C390 102 421 186 454 215"/></g>
        <path d="m20 215 39 7m362 0 39-7" stroke="url(#mileide-brass)" strokeWidth="5"/>
        <path d="M0 295Q240 270 480 295V390H0Z" fill="url(#mileide-wood)"/>
        <g stroke="#bb8354" strokeOpacity=".12"><path d="M0 312q120-18 240 0t240 0M0 333q120-18 240 0t240 0M0 367q120-18 240 0t240 0"/></g>
        <path d="m129 282 208-1 89 109H56Z" fill="url(#mileide-cloth)"/>
        <path d="m139 287-64 103m253-103 75 103" stroke="#a7844c" strokeOpacity=".5" strokeWidth="1.5"/>
        <ellipse cx="239" cy="322" rx="102" ry="16" fill="#0a080f" opacity=".7"/>
        <circle className="mileide-orb-halo" cx="240" cy="219" r="126" fill="url(#mileide-halo)"/>
        <path d="M216 294q24 16 48 0l-5 18 23 9q-42 16-84 0l23-9Z" fill="url(#mileide-brass)"/>
        <ellipse cx="240" cy="293" rx="44" ry="10" fill="url(#mileide-brass)" stroke="#bc935b" strokeOpacity=".5"/>
        <circle cx="240" cy="219" r="78" fill="url(#mileide-glass)" stroke="#cec0d9" strokeOpacity=".45"/>
        <g clipPath="url(#mileide-orbclip)">
          <ellipse className="mileide-orb-mist" cx="238" cy="242" rx="76" ry="40" fill="url(#mileide-mist)"/>
          <ellipse cx="209" cy="173" rx="27" ry="11" transform="rotate(-37 209 173)" fill="#f7efff" opacity=".22"/>
          <path d="M177 212a64 64 0 0 1 42-54" stroke="#fffcff" strokeWidth="2" strokeLinecap="round" opacity=".38"/>
          <path d="M290 253a60 60 0 0 1-34 21" stroke="#d9bdce" strokeLinecap="round" opacity=".4"/>
          <g className="mileide-orb-stars" fill="#fbecde"><path d="m239 202 2 8 8 2-8 2-2 8-2-8-8-2 8-2Z"/><circle cx="270" cy="231" r="1.2"/><circle cx="210" cy="237" r="1"/><circle cx="262" cy="184" r=".8"/></g>
        </g>
        <g transform="translate(75 205)">
          <circle cy="1" r="61" fill="url(#mileide-candlelight)"/>
          <ellipse cy="112" rx="29" ry="7" fill="#100c0e" opacity=".7"/>
          <path d="M-22 108h44l-7-7H5V76H-5v25h-10Z" fill="url(#mileide-brass)"/>
          <path d="M-16 74h32l5 5h-42Z" fill="url(#mileide-brass)"/>
          <rect x="-10" y="16" width="20" height="60" rx="3" fill="url(#mileide-wax)"/>
          <path d="M-10 21q4 8 6 1t5 6 5-7" stroke="#e8cf9e" strokeWidth="3"/>
          <path d="M0 17V9" stroke="#37221c" strokeWidth="2"/>
          <path className="mileide-flame" d="M0-14C-2-4-11 4-5 11 2 18 12 7 5 0Z" fill="url(#mileide-flame)"/>
        </g>
        <g transform="translate(395 178)">
          <circle cy="1" r="78" fill="url(#mileide-candlelight)"/>
          <ellipse cy="134" rx="29" ry="7" fill="#100c0e" opacity=".7"/>
          <path d="M-23 130h46l-8-6H5V87H-5v37h-10Z" fill="url(#mileide-brass)"/>
          <path d="M-16 86h32l5 5h-42Z" fill="url(#mileide-brass)"/>
          <rect x="-11" y="16" width="22" height="72" rx="3" fill="url(#mileide-wax)"/>
          <path d="M-10 22q4 8 6 2t6 5 8-6" stroke="#e8cf9e" strokeWidth="3"/>
          <path d="M0 17V9" stroke="#37221c" strokeWidth="2"/>
          <path className="mileide-flame mileide-flame--second" d="M1-15C-1-4-12 4-5 11 2 18 12 7 5 0Z" fill="url(#mileide-flame)"/>
        </g>
        <g transform="translate(118 318)">
          <path d="m-21 7-7-25 10-23 13 23L0 7Z" fill="url(#mileide-quartz)"/><path d="m-10 9-2-42 13-24 12 22-3 44Z" fill="url(#mileide-quartz)"/><path d="M7 9 14-17 29-28 31-6 19 11Z" fill="url(#mileide-quartz)"/>
          <path d="m1-57 2 66m-21-50 6 49m41-36L18 8" stroke="#ecdcf7" strokeOpacity=".4"/>
        </g>
        <g transform="translate(336 334) rotate(16)"><path d="m-20 0 4-32 13-18 12 21L5 6Z" fill="#9faaa9" opacity=".75"/><path d="m-3-50 2 51 10-30Z" fill="#dee0d5" opacity=".4"/><path d="m5 8 7-22 19-12-1 23-16 13Z" fill="url(#mileide-quartz)"/></g>
        <g transform="translate(203 343) rotate(-10)"><rect width="43" height="68" rx="3" fill="#191a2d" stroke="#b6935e"/><rect x="4" y="4" width="35" height="60" rx="2" stroke="#b6935e" strokeOpacity=".5"/><path d="m21 23 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" stroke="#d3b17a"/></g>
        <g fill="#ddb679" opacity=".6"><circle cx="167" cy="320" r="1"/><circle cx="305" cy="315" r="1.5"/><circle cx="277" cy="351" r="1"/></g>
      </svg>
    </div>
  );
}
