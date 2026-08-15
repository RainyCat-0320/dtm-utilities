import { useState } from 'react'
import styles from './App.module.css'
import DelayReverbCalculator from './components/DelayReverbCalculator/DelayReverbCalculator'
import BpmTapMeasure from './components/BpmTapMeasure/BpmTapMeasure'
import FrequencyNoteConverter from './components/FrequencyNoteConverter/FrequencyNoteConverter'
import LufsPlrReference from './components/LufsPlrReference/LufsPlrReference'
import GainStagingReference from './components/GainStagingReference/GainStagingReference'

type TabId = 'delay-reverb' | 'bpm-tap' | 'freq-note' | 'lufs-plr' | 'gain-staging'

const tabs: { id: TabId; label: string }[] = [
  { id: 'delay-reverb', label: 'ディレイ/リバーブ' },
  { id: 'bpm-tap', label: 'BPMタップ' },
  { id: 'freq-note', label: '周波数⇔ノート' },
  { id: 'lufs-plr', label: 'LUFS/PLR' },
  { id: 'gain-staging', label: 'ゲインステージング' },
]

function App() {
  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id)
  const [bpmHandoff, setBpmHandoff] = useState<number | undefined>(undefined)

  function handleTransferBpm(bpm: number) {
    setBpmHandoff(bpm)
    setActiveTab('delay-reverb')
  }

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
        {activeTab === 'delay-reverb' && (
          <DelayReverbCalculator initialBpm={bpmHandoff} />
        )}
        {activeTab === 'bpm-tap' && <BpmTapMeasure onTransferBpm={handleTransferBpm} />}
        {activeTab === 'freq-note' && <FrequencyNoteConverter />}
        {activeTab === 'lufs-plr' && <LufsPlrReference />}
        {activeTab === 'gain-staging' && <GainStagingReference />}
      </main>
    </div>
  )
}

export default App
