import React, { useState, useEffect, useMemo } from 'react';
import NightFlashcards, { FullscreenFlashcard } from './components/NightFlashcards';

const ROLES_DB = {
  washerwoman: ['Tvätterska', 'townsfolk', '🧺', 'Du börjar med att veta att 1 av 2 spelare är en specifik stadsbo.'],
  librarian: ['Bibliotekarie', 'townsfolk', '📚', 'Du börjar med att veta att 1 av 2 spelare är en specifik utböling, eller att inga finns i spel.'],
  investigator: ['Utredare', 'townsfolk', '🔍', 'Du börjar med att veta att 1 av 2 spelare är en specifik hantlangare.'],
  chef: ['Kock', 'townsfolk', '🧑‍🍳', 'Du börjar med att veta hur många par av onda spelare som sitter bredvid varandra.'],
  empath: ['Empat', 'townsfolk', '👁️', 'Varje natt får du veta hur många av dina 2 levande grannar som är onda.'],
  fortuneteller: ['Siare', 'townsfolk', '🔮', 'Varje natt, välj 2 spelare: du får veta om någon av dem är en demon. 1 god spelare registreras som en demon.'],
  undertaker: ['Dödgrävare', 'townsfolk', '⚰️', 'Varje natt* får du veta vilken karaktär som dog genom avrättning i dag.'],
  monk: ['Munk', 'townsfolk', '🛡️', 'Varje natt*, välj en spelare (inte dig själv): den är skyddad från demonen i natt.'],
  ravenkeeper: ['Korphållare', 'townsfolk', '🦅', 'Om du dör på natten väcks du för att välja en spelare: du får veta dennes karaktär.'],
  virgin: ['Jungfru', 'townsfolk', '🕊️', 'Första gången du blir nominerad, om den som nominerar är en stadsbo, avrättas den omedelbart.'],
  slayer: ['Dråpare', 'townsfolk', '🏹', 'En gång per spel, under dagen, välj offentligt en spelare: om den är demonen dör den.'],
  soldier: ['Soldat', 'townsfolk', '⚔️', 'Du är skyddad från demonen.'],
  mayor: ['Borgmästare', 'townsfolk', '🏛️', 'Om bara 3 spelare lever och ingen avrättning sker vinner ditt lag. Om du dör på natten kan en annan spelare dö i stället.'],
  butler: ['Betjänt', 'outsider', '🛎️', 'Varje natt, välj en husbonde: du får bara rösta om den också röstar.'],
  drunk: ['Fyllo', 'outsider', '🍺', 'Du vet inte att du är fyllot. Du tror att du är en stadsbo, men det är du inte.'],
  recluse: ['Enstöring', 'outsider', '🦹', 'Du kan registreras som ond och som hantlangare eller demon, även när du är död.'],
  saint: ['Helgon', 'outsider', '😇', 'Om du dör genom avrättning förlorar ditt lag.'],
  poisoner: ['Förgiftare', 'minion', '🧪', 'Varje natt, välj en spelare: den är förgiftad i natt och under morgondagen.'],
  spy: ['Spion', 'minion', '🕵️', 'Varje natt ser du grimoiren. Du kan registreras som god och som stadsbo eller utböling, även när du är död.'],
  scarletwoman: ['Prostituerad', 'minion', '💃', 'Om 5 eller fler spelare lever och demonen dör blir du demonen.'],
  baron: ['Baron', 'minion', '🎩', 'Det finns extra utbölingar i spel. [+2 utbölingar]'],
  imp: ['Demon', 'demon', '😈', 'Varje natt*, välj en spelare: den dör. Om du dödar dig själv på detta sätt blir en hantlangare den nya demonen.'],
};

const TEAM_STYLES = {
  townsfolk: { label: 'Stadsbor', name: 'Stadsbo', border: 'border-blue-500', bg: 'bg-blue-950/60', text: 'text-blue-300', badge: 'bg-blue-600' },
  outsider: { label: 'Utbölingar', name: 'Utböling', border: 'border-cyan-500', bg: 'bg-cyan-950/60', text: 'text-cyan-300', badge: 'bg-cyan-600' },
  minion: { label: 'Hantlangare', name: 'Hantlangare', border: 'border-orange-500', bg: 'bg-orange-950/60', text: 'text-orange-300', badge: 'bg-orange-600' },
  demon: { label: 'Demoner', name: 'Demon', border: 'border-red-500', bg: 'bg-red-950/60', text: 'text-red-300', badge: 'bg-red-600' },
  unknown: { label: 'Egna / Övriga', name: 'Övrig', border: 'border-zinc-500', bg: 'bg-zinc-900', text: 'text-zinc-300', badge: 'bg-zinc-600' },
};

const getRoleInfo = (id) => {
  const cleanId = String(id).toLowerCase().replace(/[^a-z0-9]/g, '');
  if (ROLES_DB[cleanId]) {
    return {
      id: cleanId,
      name: ROLES_DB[cleanId][0],
      team: ROLES_DB[cleanId][1],
      icon: ROLES_DB[cleanId][2] || '✦',
      ability: ROLES_DB[cleanId][3] || '',
      teamName: TEAM_STYLES[ROLES_DB[cleanId][1]].name,
    };
  }
  return {
    id: cleanId,
    name: String(id).replace(/_/g, ' '),
    team: 'unknown',
    icon: '✦',
    ability: '',
    teamName: TEAM_STYLES.unknown.name,
  };
};

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn(`Failed to read ${key} from localStorage`, e);
    }
    return defaultValue;
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to write ${key} to localStorage`, e);
    }
  }, [key, value]);

  return [value, setValue];
}

export default function App() {
  const [activeTab, setActiveTab] = useLocalStorage('botc_active_tab', 'bag');
  const [scriptName, setScriptName] = useLocalStorage('botc_script_name', 'Trouble Brewing');
  const [scriptRoles, setScriptRoles] = useLocalStorage('botc_script_roles', Object.keys(ROLES_DB));
  const [bagRoles, setBagRoles] = useLocalStorage('botc_bag_roles', []);
  const [drunkDisguise, setDrunkDisguise] = useLocalStorage('botc_drunk_disguise', '');
  const [seats, setSeats] = useLocalStorage('botc_seats', []);
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);
  const [fullscreenCard, setFullscreenCard] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        if (!Array.isArray(json)) throw new Error();
        let name = file.name.replace('.json', '');
        const roles = [];
        json.forEach((item) => {
          if (typeof item === 'string') roles.push(item);
          else if (item?.id === '_meta' && item.name) name = item.name;
          else if (item?.id) roles.push(item.id);
        });
        if (roles.length) {
          setScriptName(name);
          setScriptRoles(roles);
          setBagRoles([]);
          setDrunkDisguise('');
          setSeats([]);
        }
      } catch {
        alert('Ogiltig skript-JSON');
      }
    };
    reader.readAsText(file);
  };

  const toggleRoleInBag = (roleId) => {
    setBagRoles((prev) => {
      if (prev.includes(roleId)) {
        if (roleId === 'drunk') setDrunkDisguise('');
        return prev.filter((r) => r !== roleId);
      }
      if (drunkDisguise === roleId) setDrunkDisguise('');
      return [...prev, roleId];
    });
  };

  const isDrunkInBag = bagRoles.includes('drunk');

  const availableTownsfolkForDrunk = useMemo(
    () => scriptRoles.map(getRoleInfo).filter((r) => r.team === 'townsfolk' && !bagRoles.includes(r.id)),
    [scriptRoles, bagRoles]
  );

  const physicalTokensInBag = useMemo(
    () => bagRoles.map((r) => (r === 'drunk' ? drunkDisguise : r)).filter(Boolean),
    [bagRoles, drunkDisguise]
  );

  const startSeating = () => {
    if (isDrunkInBag && !drunkDisguise) {
      alert('Välj först en stadsbo-förklädnad åt fyllot!');
      return;
    }
    setSeats((prev) =>
      Array.from({ length: physicalTokensInBag.length }, (_, i) => ({
        seat: i + 1,
        name: prev[i]?.name || '',
        drawnToken: prev[i]?.drawnToken && physicalTokensInBag.includes(prev[i].drawnToken) ? prev[i].drawnToken : null,
      }))
    );
    setActiveTab('seating');
  };

  const unassignedTokens = useMemo(() => {
    const used = seats.map((s) => s.drawnToken).filter(Boolean);
    return physicalTokensInBag.filter((t) => !used.includes(t));
  }, [physicalTokensInBag, seats]);

  const assignToken = (idx, token) => {
    setSeats((prev) => prev.map((s, i) => (i === idx ? { ...s, drawnToken: token } : s)));
    setSelectedSeatIndex(null);
  };

  const groupedScript = useMemo(() => {
    const g = { townsfolk: [], outsider: [], minion: [], demon: [], unknown: [] };
    scriptRoles.forEach((id) => {
      const info = getRoleInfo(id);
      g[info.team].push(info);
    });
    return g;
  }, [scriptRoles]);

  const handleResetGame = () => {
    if (window.confirm('Återställ pågående spel? Alla platser och valda roller i påsen rensas.')) {
      setBagRoles([]);
      setDrunkDisguise('');
      setSeats([]);
      setActiveTab('bag');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-36 font-sans select-none">
      <FullscreenFlashcard card={fullscreenCard} onClose={() => setFullscreenCard(null)} />

      <header className="sticky top-0 z-20 bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-amber-400">BotC Pocket Grimoire</h1>
          <p className="text-xs text-zinc-400">Skript: <b className="text-zinc-200">{scriptName}</b></p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleResetGame}
            title="Återställ pågående spel och börja om"
            className="text-xs text-zinc-400 hover:text-rose-400 border border-zinc-700 hover:border-rose-900/60 bg-zinc-800 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>↺</span>
            <span className="hidden sm:inline">Återställ</span>
          </button>
          <button
            onClick={() => setActiveTab('night')}
            className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
              activeTab === 'night'
                ? 'bg-amber-500 text-zinc-950 border-amber-400'
                : 'bg-zinc-800 text-amber-400 border-zinc-700 hover:bg-zinc-700'
            }`}
          >
            <span>🌙</span>
            <span className="hidden sm:inline">Stor text</span>
          </button>
          <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-zinc-700">
            Ladda JSON
            <input type="file" accept=".json,application/json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </header>

      <div className="grid grid-cols-3 bg-zinc-900 border-b border-zinc-800 text-xs sm:text-sm font-medium">
        <button
          onClick={() => setActiveTab('bag')}
          className={`py-3 border-b-2 ${activeTab === 'bag' ? 'border-amber-400 text-amber-400 bg-zinc-800/40' : 'border-transparent text-zinc-400'}`}
        >
          1. Påse ({bagRoles.length})
        </button>
        <button
          onClick={startSeating}
          disabled={!bagRoles.length}
          className={`py-3 border-b-2 ${activeTab === 'seating' ? 'border-amber-400 text-amber-400 bg-zinc-800/40' : 'border-transparent text-zinc-400 disabled:opacity-40'}`}
        >
          2. Platser ({seats.filter((s) => s.drawnToken).length}/{bagRoles.length})
        </button>
        <button
          onClick={() => setActiveTab('night')}
          className={`py-3 border-b-2 flex items-center justify-center gap-1 ${activeTab === 'night' ? 'border-amber-400 text-amber-400 bg-zinc-800/40' : 'border-transparent text-zinc-400'}`}
        >
          <span>3. Kort</span>
          <span className="text-xs">🌙</span>
        </button>
      </div>

      {activeTab === 'bag' && (
        <main className="p-4 space-y-5 max-w-lg mx-auto">
          {Object.entries(groupedScript).map(([teamKey, roles]) => {
            if (!roles.length) return null;
            const st = TEAM_STYLES[teamKey];
            return (
              <section key={teamKey} className="space-y-2">
                <h2 className={`text-xs font-bold uppercase ${st.text}`}>{st.label}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((r) => {
                    const sel = bagRoles.includes(r.id);
                    const dis = drunkDisguise === r.id;
                    return (
                      <button
                        key={r.id}
                        onClick={() => toggleRoleInBag(r.id)}
                        className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium flex items-center justify-between ${
                          sel ? `${st.bg} ${st.border} text-white` : dis ? 'bg-amber-950/40 border-amber-500 text-amber-300' : 'bg-zinc-900 border-zinc-800 text-zinc-400'
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <span>{r.icon}</span>
                          <span>{r.name}</span>
                        </span>
                        {sel && <span className={`w-2.5 h-2.5 rounded-full ${st.badge} shrink-0`} />}
                        {dis && <span className="text-[10px] font-bold bg-amber-500 text-zinc-950 px-1.5 rounded shrink-0">FYLLO</span>}
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}

          {bagRoles.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 p-3 bg-zinc-900 border-t border-zinc-800 space-y-2 z-20">
              {isDrunkInBag && (
                <div className="max-w-lg mx-auto flex items-center gap-2 bg-amber-950/60 border border-amber-500/60 px-3 py-2 rounded-xl">
                  <span className="text-xs font-bold text-amber-300 shrink-0">Fyllots polett:</span>
                  <select
                    value={drunkDisguise}
                    onChange={(e) => setDrunkDisguise(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-100 w-full"
                  >
                    <option value="">-- Välj stadsbo-förklädnad --</option>
                    {availableTownsfolkForDrunk.map((tf) => (
                      <option key={tf.id} value={tf.id}>{tf.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="max-w-lg mx-auto flex items-center justify-between">
                <div className="text-xs text-zinc-300">
                  Spelare: <b className="text-white">{bagRoles.length}</b> | Påsen klar: {physicalTokensInBag.length}/{bagRoles.length}
                </div>
                <button onClick={startSeating} className="bg-amber-500 text-zinc-950 font-bold text-sm px-4 py-2 rounded-xl">
                  Bekräfta påse
                </button>
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === 'seating' && (
        <main className="p-4 space-y-4 max-w-lg mx-auto">
          <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs">
            <div className="text-zinc-400 mb-1.5">Kvar i påsen ({unassignedTokens.length}):</div>
            <div className="flex flex-wrap gap-1.5">
              {unassignedTokens.length === 0 ? (
                <span className="text-emerald-400 font-bold">Alla poletter utdelade!</span>
              ) : (
                unassignedTokens.map((id) => (
                  <span key={id} className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 flex items-center gap-1">
                    <span>{getRoleInfo(id).icon}</span>
                    <span>{getRoleInfo(id).name}</span>
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            {seats.map((s, idx) => {
              const drawn = s.drawnToken ? getRoleInfo(s.drawnToken) : null;
              const isDrunk = s.drawnToken && s.drawnToken === drunkDisguise;
              const actual = isDrunk ? getRoleInfo('drunk') : drawn;
              const st = actual ? TEAM_STYLES[actual.team] : null;

              return (
                <div key={s.seat} className={`p-3 rounded-xl border flex items-center justify-between gap-2 ${drawn ? `${st.bg} ${st.border}` : 'bg-zinc-900 border-zinc-800'}`}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-xs shrink-0">
                      #{s.seat}
                    </span>
                    <input
                      type="text"
                      placeholder="Spelarens namn (valfritt)"
                      value={s.name}
                      onChange={(e) => setSeats((p) => p.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))}
                      className="bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none w-full truncate"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {drawn && (
                      <button
                        onClick={() =>
                          // Kortet visas för spelaren: fyllot ska se sin förklädnad (den dragna poletten), aldrig att den är fyllot.
                          setFullscreenCard({
                            title: drawn.name,
                            subtitle: s.name ? `Plats #${s.seat} • ${s.name}` : `Plats #${s.seat}`,
                            icon: drawn.icon,
                            team: drawn.team,
                            teamLabel: drawn.teamName.toUpperCase(),
                            description: drawn.ability,
                          })
                        }
                        title="Visa rollen för spelaren med stor text"
                        className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-750 px-2 py-1.5 rounded-lg text-xs text-zinc-300 hover:text-white"
                      >
                        👁️ Visa
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedSeatIndex(idx)}
                      className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-400"
                    >
                      {drawn ? (
                        <span className="text-white">
                          {drawn.name} {isDrunk && <b className="bg-amber-500 text-zinc-950 px-1 rounded ml-1">FYLLO</b>}
                        </span>
                      ) : (
                        '+ Tilldela roll'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedSeatIndex !== null && (
            <div className="fixed inset-0 z-30 bg-black/75 flex items-end sm:items-center justify-center p-4" onClick={() => setSelectedSeatIndex(null)}>
              <div className="bg-zinc-900 border border-zinc-700 rounded-2xl w-full max-w-md p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                  <span className="font-bold text-sm">Plats #{seats[selectedSeatIndex].seat} — Välj dragen polett</span>
                  <button onClick={() => setSelectedSeatIndex(null)} className="text-zinc-400 px-2">✕</button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {physicalTokensInBag.map((tid) => {
                    const info = getRoleInfo(tid);
                    const taken = seats.find((x) => x.drawnToken === tid);
                    const curr = seats[selectedSeatIndex].drawnToken === tid;
                    return (
                      <button
                        key={tid}
                        disabled={taken && !curr}
                        onClick={() => assignToken(selectedSeatIndex, tid)}
                        className={`p-2.5 rounded-xl border text-left text-xs ${
                          curr ? 'border-amber-400 bg-amber-500/20' : taken ? 'opacity-40 bg-zinc-950 border-zinc-800' : 'bg-zinc-800 border-zinc-700'
                        }`}
                      >
                        <div className="font-bold text-sm flex items-center gap-1.5">
                          <span>{info.icon}</span>
                          <span>{info.name}</span>
                        </div>
                        <div className="text-zinc-400">{taken ? `Plats #${taken.seat}` : 'I påsen'}</div>
                      </button>
                    );
                  })}
                </div>
                {seats[selectedSeatIndex].drawnToken && (
                  <button onClick={() => assignToken(selectedSeatIndex, null)} className="w-full py-2 text-xs text-red-400 border border-red-900/40 rounded-lg">
                    Töm plats
                  </button>
                )}
              </div>
            </div>
          )}
        </main>
      )}

      {activeTab === 'night' && (
        <NightFlashcards
          scriptRoles={scriptRoles}
          bagRoles={bagRoles}
          getRoleInfo={getRoleInfo}
          onShowCard={(card) => setFullscreenCard(card)}
        />
      )}
    </div>
  );
}
