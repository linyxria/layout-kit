import {
  AutoGrid,
  MasonryLayout,
  ResizablePanel,
  ScreenFit,
  VirtualList,
} from '@layout-kit/react'

const rows = Array.from(
  { length: 10000 },
  (_, index) => `React 条目 ${String(index + 1).padStart(4, '0')}`,
)

const cards = [
  ['列数', '跟着容器宽度变化'],
  ['刷新', '首屏不再明显跳动'],
  ['事件', '拿到组件状态变化'],
]

const masonryCards = [
  ['需求卡片', 'tall'],
  ['短备注', 'short'],
  ['内容多一点的任务', 'medium'],
  ['看板项会自动找更短的列', 'tall'],
  ['补充信息', 'medium'],
]

export default function ReactApp() {
  return (
    <div className="demo-surface">
      <AutoGrid columnWidth={190} gap={14}>
        {cards.map(([label, value]) => (
          <article className="metric-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </AutoGrid>

      <VirtualList height={192} itemHeight={44} className="list-demo">
        {rows.map((row) => (
          <article className="list-row" key={row}>
            <span>{row}</span>
            <small>当前渲染</small>
          </article>
        ))}
      </VirtualList>

      <MasonryLayout columnWidth={170} gap={14} className="masonry-demo">
        {masonryCards.map(([text, size]) => (
          <article className={`masonry-card ${size}`} key={text}>
            {text}
          </article>
        ))}
      </MasonryLayout>

      <ScreenFit draftWidth={640} draftHeight={360} className="fit-demo">
        <article className="fit-canvas">
          <span>React 画布</span>
          <strong>父容器缩放</strong>
        </article>
      </ScreenFit>

      <ResizablePanel size={42} min={25} max={75} className="panel">
        <div slot="start" className="panel-pane">
          <span>左侧区域</span>
          <strong>拖动中间分隔条</strong>
        </div>
        <div slot="end" className="panel-pane">
          <span>右侧区域</span>
          <strong>宽度会实时变化</strong>
        </div>
      </ResizablePanel>
    </div>
  )
}
