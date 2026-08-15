import { useState, type ComponentType } from 'react'
import styles from './App.module.css'
import DelayReverbCalculator from './components/DelayReverbCalculator/DelayReverbCalculator'
import BpmTapMeasure from './components/BpmTapMeasure/BpmTapMeasure'
import FrequencyNoteConverter from './components/FrequencyNoteConverter/FrequencyNoteConverter'
import LufsPlrReference from './components/LufsPlrReference/LufsPlrReference'
import GainStagingReference from './components/GainStagingReference/GainStagingReference'

type TabId = 'delay-reverb' | 'bpm-tap' | 'freq-note' | 'lufs-plr' | 'gain-staging'

const tabs: { id: TabId; label: string; Panel: ComponentType }[] = [
  { id: 'delay-reverb', label: 'ディレイ/リバーブ', Panel: DelayReverbCalculator },
  { id: 'bpm-tap', label: 'BPMタップ', Panel: BpmTapMeasure },
  { id: 'freq-note', label: '周波数⇔ノート', Panel: FrequencyNoteConverter },
  { id: 'lufs-plr', label: 'LUFS/PLR', Panel: LufsPlrReference },
  { id: 'gain-staging', label: 'ゲインステージング', Panel: GainStagingReference },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id)
  const ActivePanel = tabs.find((tab) => tab.id === activeTab)?.Panel ?? tabs[0].Panel

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1 className={styles.title}>DTM Utilities</h1>
      </header>
      <nav className={styles.tabList} role="tablist" aria-label="機能タブ">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <main className={styles.panel} role="tabpanel">
        <ActivePanel />
      </main>
    </div>
  )
}

export default App
