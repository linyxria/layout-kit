const setText = (selector, value) => {
  const element = document.querySelector(selector)

  if (element) {
    element.textContent = value
  }
}

const formatScale = (scale) => `${Math.round(scale * 100)}%`

document.addEventListener("grid", (event) => {
  setText("[data-grid-count]", String(event.detail.columns))
})

document.addEventListener("scale", (event) => {
  setText("[data-scale-value]", formatScale(event.detail.scale))
})

document.addEventListener("range", (event) => {
  setText("[data-range-value]", `${event.detail.start}-${event.detail.end}`)
})

document.addEventListener("resize", (event) => {
  setText("[data-panel-size]", `${Math.round(event.detail.size)}%`)
})

document.addEventListener("ambient", (event) => {
  setText("[data-ambient-color]", event.detail.color)
})

const sectionLinks = new Map(
  Array.from(document.querySelectorAll("[data-nav-link]")).map((link) => [
    link.getAttribute("href")?.slice(1),
    link,
  ]),
)

const setActiveSection = (id) => {
  for (const [sectionId, link] of sectionLinks) {
    link.classList.toggle("active", sectionId === id)
  }
}

const sections = Array.from(document.querySelectorAll("[data-section]"))

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

      if (visible?.target.id) {
        setActiveSection(visible.target.id)
      }
    },
    { rootMargin: "-24% 0px -55% 0px", threshold: [0.12, 0.3, 0.6] },
  )

  for (const section of sections) {
    observer.observe(section)
  }
}
