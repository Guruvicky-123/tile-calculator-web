import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PDFReport } from './components/PDFReport';

// ✅ Types
type WallKey = 'east' | 'south' | 'west' | 'north';

interface WallData {
  floating: string;
  area: string;
}

interface WallResult {
  tiles: number;
  covered: number;
  wallArea: number;
  percent: number;
}

function App() {
  const [tileSize, setTileSize] = useState({ width: '', height: '' });

  const [walls, setWalls] = useState<Record<WallKey, WallData>>({
    east: { floating: '', area: '' },
    south: { floating: '', area: '' },
    west: { floating: '', area: '' },
    north: { floating: '', area: '' },
  });

  const [result, setResult] = useState<{
    totalCovered: number;
    totalWall: number;
    totalPercent: number;
    wallResults: Record<WallKey, WallResult>;
  } | null>(null);

  const handleChange = (wall: WallKey, field: keyof WallData, value: string) => {
    setWalls(prev => ({
      ...prev,
      [wall]: {
        ...prev[wall],
        [field]: value
      }
    }));
  };

  const calculate = () => {
    const w = parseFloat(tileSize.width);
    const h = parseFloat(tileSize.height);
    const tileArea = (w * h) / 10000;

    let totalCovered = 0;
    let totalWall = 0;
    const wallResults: Record<WallKey, WallResult> = {
      east: { tiles: 0, covered: 0, wallArea: 0, percent: 0 },
      south: { tiles: 0, covered: 0, wallArea: 0, percent: 0 },
      west: { tiles: 0, covered: 0, wallArea: 0, percent: 0 },
      north: { tiles: 0, covered: 0, wallArea: 0, percent: 0 },
    };

    (Object.keys(walls) as WallKey[]).forEach((key) => {
      const tiles = parseInt(walls[key].floating) || 0;
      const wallArea = parseFloat(walls[key].area) || 0;
      const covered = tiles * tileArea;
      const percent = wallArea > 0 ? (covered / wallArea) * 100 : 0;

      wallResults[key] = { tiles, covered, wallArea, percent };
      totalCovered += covered;
      totalWall += wallArea;
    });

    setResult({
      totalCovered,
      totalWall,
      totalPercent: totalWall > 0 ? (totalCovered / totalWall) * 100 : 0,
      wallResults
    });
  };

  const reset = () => {
    setTileSize({ width: '', height: '' });
    setWalls({
      east: { floating: '', area: '' },
      south: { floating: '', area: '' },
      west: { floating: '', area: '' },
      north: { floating: '', area: '' },
    });
    setResult(null);
  };

  const wallLabels: Record<WallKey, string> = {
    east: '東面',
    south: '南面',
    west: '西面',
    north: '北面'
  };

  return (
    <div className="min-h-screen bg-[#f0f8ff] p-6">
      <h1 className="text-2xl font-bold text-center mb-6">外壁タイル浮き計算アプリ</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-xl mb-3">タイルサイズ (cm)</h2>
        <div className="flex gap-6">
          <input
            type="number"
            placeholder="幅"
            className="px-3 py-2 border rounded w-24"
            value={tileSize.width}
            onChange={(e) => setTileSize({ ...tileSize, width: e.target.value })}
          />
          <input
            type="number"
            placeholder="高さ"
            className="px-3 py-2 border rounded w-24"
            value={tileSize.height}
            onChange={(e) => setTileSize({ ...tileSize, height: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-2 gap-6">
        {(Object.keys(wallLabels) as WallKey[]).map((key) => (
          <div key={key}>
            <h3 className="text-lg font-semibold mb-2">{wallLabels[key]}</h3>
            <input
              type="number"
              placeholder="浮きタイル枚数"
              className="px-3 py-2 border rounded w-full mb-2"
              value={walls[key].floating}
              onChange={(e) => handleChange(key, 'floating', e.target.value)}
            />
            <input
              type="number"
              placeholder="壁面積 (m²)"
              className="px-3 py-2 border rounded w-full"
              value={walls[key].area}
              onChange={(e) => handleChange(key, 'area', e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={calculate}
          className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          計算する
        </button>
        <button
          onClick={reset}
          className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
        >
          リセット
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-3">計算結果</h2>
          {(Object.keys(result.wallResults) as WallKey[]).map((key) => {
            const res = result.wallResults[key];
            if (res.tiles === 0 || res.wallArea === 0) return null; // ✅ Hide empty walls

            return (
              <div key={key} className="mb-2">
                <p className="font-semibold">{wallLabels[key]}</p>
                <p>浮き面積: {res.covered.toFixed(2)} m²</p>
                <p>壁面積: {res.wallArea.toFixed(2)} m²</p>
                <p>浮き率: {res.percent.toFixed(2)}%</p>
              </div>
            );
          })}

          <hr className="my-3" />
          <p><strong>合計浮き面積:</strong> {result.totalCovered.toFixed(2)} m²</p>
          <p><strong>合計壁面積:</strong> {result.totalWall.toFixed(2)} m²</p>
          <p><strong>全体の浮き率:</strong> {result.totalPercent.toFixed(2)}%</p>

          <div className="text-center mt-6">
            <PDFDownloadLink
              document={<PDFReport result={result!} tileSize={tileSize} />}
              fileName="tile-floating-report.pdf"
              className="inline-block px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              PDF出力
            </PDFDownloadLink>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
