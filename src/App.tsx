import React, { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";

interface Ornament {
  src: string;
  x: number;
  y: number;
}

function TreeContainer({
  children,
  width = 400,
  height = 533,
}: {
  children?: React.ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <div
      style={{
        position: "relative",
        width: width,
        height: height,
        margin: "0 auto",
        backgroundImage: "url('/tree.png')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [gameState, setGameState] = useState<"menu" | "playing" | "completed">("menu");
  const [ornaments, setOrnaments] = useState<Ornament[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState(false);

  const treeRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const dragIndex = useRef<number | null>(null);
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const ornamentList = [
    { id: 1, src: "/ornaments/star.png", label: "⭐ 별" },
    { id: 2, src: "/ornaments/bell.png", label: "🔔 종" },
    { id: 3, src: "/ornaments/candy.png", label: "🍭 사탕" },
    { id: 4, src: "/ornaments/angel.png", label: "👼 천사" },
  ];

  function addOrnament(src: string) {
    if (!treeRef.current) return;
    setOrnaments((prev) => [
      ...prev,
      {
        src,
        x: treeRef.current.clientWidth * 0.4,
        y: treeRef.current.clientHeight * 0.5,
      },
    ]);
  }

  function resetTree() {
    setOrnaments([]);
    setSecretUnlocked(false);
  }

  function handleMouseDown(e: React.MouseEvent, index: number) {
    dragIndex.current = index;
    const rect = treeRef.current!.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left - ornaments[index].x,
      y: e.clientY - rect.top - ornaments[index].y,
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(e: MouseEvent) {
    if (dragIndex.current === null) return;
    const rect = treeRef.current!.getBoundingClientRect();
    const newX = e.clientX - rect.left - offset.current.x;
    const newY = e.clientY - rect.top - offset.current.y;
    setOrnaments((prev) =>
      prev.map((orn, i) => (i === dragIndex.current ? { ...orn, x: newX, y: newY } : orn))
    );
  }

  function handleMouseUp() {
    dragIndex.current = null;
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  useEffect(() => {
    const placed = ornaments.map((o) => o.src);
    const secretOrder = ["/ornaments/star.png", "/ornaments/bell.png", "/ornaments/candy.png", "/ornaments/angel.png"];
    if (placed.length === secretOrder.length && secretOrder.every((s, i) => s === placed[i])) {
      setSecretUnlocked(true);
    }
  }, [ornaments]);

  // 눈 내림
  const snowflakes = [...Array(50)].map((_, i) => ({
    id: i,
    style: {
      position: "absolute" as "absolute",
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "white",
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animation: `fall ${2 + Math.random() * 3}s linear ${Math.random() * 5}s infinite`,
    },
  }));

  return (
    <div
      ref={appRef}
      style={{
        minHeight: "100vh",
        background: "#c0f0c0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: 20,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {snowflakes.map((s) => (
        <div key={s.id} style={s.style}></div>
      ))}

      {gameState === "menu" && (
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          <h1 style={{ fontSize: 32, color: "darkgreen", marginBottom: 20, fontWeight: "bold" }}>
            🎄 크리스마스 트리 꾸미기 🎄
          </h1>
          <TreeContainer>
            <div style={{ position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)", fontSize: 40 }}>
              🌟
            </div>
          </TreeContainer>
          <button
            onClick={() => setGameState("playing")}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              fontWeight: "bold",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            시작하기 🎉
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, marginBottom: 10 }}>🎁 트리를 꾸며보세요!</h2>
          <TreeContainer>
            <div ref={treeRef} style={{ width: "100%", height: "100%", position: "relative" }}>
              {ornaments.map((orn, i) => (
                <img
                  key={i}
                  src={orn.src}
                  alt="ornament"
                  style={{ position: "absolute", top: orn.y, left: orn.x, width: 40, height: 40, cursor: "grab" }}
                  onMouseDown={(e) => handleMouseDown(e, i)}
                  draggable={false}
                />
              ))}
              {secretUnlocked && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.7)",
                    fontSize: 24,
                    fontWeight: "bold",
                    animation: "bounce 1s infinite",
                  }}
                >
                  🎉 Secret Event! 🎉
                </div>
              )}
            </div>
          </TreeContainer>
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 10 }}>
            {ornamentList.map((o) => (
              <button
                key={o.id}
                onClick={() => addOrnament(o.src)}
                style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}
              >
                <img src={o.src} alt={o.label} width={40} height={40} />
              </button>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={resetTree}
              style={{ marginRight: 10, padding: "5px 15px", fontWeight: "bold", background: "gray", color: "white", border: "none", borderRadius: 5 }}
            >
              초기화
            </button>
            <button
              onClick={() => setGameState("completed")}
              style={{ padding: "5px 15px", fontWeight: "bold", background: "green", color: "white", border: "none", borderRadius: 5 }}
            >
              완성
            </button>
          </div>
        </div>
      )}

      {gameState === "completed" && (
        <div style={{ width: "100%", maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: 24, marginBottom: 10 }}>✨ 나만의 트리가 완성되었어요! ✨</h2>
          <TreeContainer>
            <div ref={treeRef} style={{ width: "100%", height: "100%", position: "relative" }}>
              {ornaments.map((orn, i) => (
                <img key={i} src={orn.src} alt="ornament" style={{ position: "absolute", top: orn.y, left: orn.x, width: 40, height: 40 }} />
              ))}
              {secretUnlocked && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "rgba(255,255,255,0.7)",
                    fontSize: 24,
                    fontWeight: "bold",
                    animation: "bounce 1s infinite",
                  }}
                >
                  🎆 비밀 트리 완성! 🎆
                </div>
              )}
            </div>
          </TreeContainer>
          <button
            onClick={async () => {
              if (!appRef.current) return;
              const canvas = await html2canvas(appRef.current);
              const link = document.createElement("a");
              link.download = "my-christmas-tree.png";
              link.href = canvas.toDataURL("image/png");
              link.click();
            }}
            style={{ marginTop: 10, padding: "10px 20px", fontWeight: "bold", background: "blue", color: "white", border: "none", borderRadius: 10 }}
          >
            공유하기
          </button>
        </div>
      )}
    </div>
  );
}
