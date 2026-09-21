import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { OAKWOOD_TEMPLATE } from '../data/oakwood-template'
import {
  breadcrumbSegments,
  expandHex,
  getMapAtPath,
  removeSubMap,
  updateMapAtPath,
} from '../lib/map-tree'
import { loadFromLocalStorage, saveToLocalStorage } from '../lib/persistence'
import { cloneMap } from '../lib/validation'
import type { FactionGoal, HexCrawlerMap, MapPath } from '../types/map'

function getInitialMap(): HexCrawlerMap {
  return loadFromLocalStorage() ?? cloneMap(OAKWOOD_TEMPLATE)
}

export function useMapState() {
  const [rootMap, setRootMap] = useState<HexCrawlerMap>(getInitialMap)
  const [path, setPath] = useState<MapPath>([])
  const [selectedHexId, setSelectedHexId] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const map = useMemo(() => {
    try {
      return getMapAtPath(rootMap, path)
    } catch {
      return rootMap
    }
  }, [rootMap, path])

  const breadcrumbs = useMemo(() => breadcrumbSegments(rootMap, path), [rootMap, path])

  const showMessage = useCallback((text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }, [])

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveToLocalStorage(rootMap), 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [rootMap])

  const updateActiveMap = useCallback((updater: (map: HexCrawlerMap) => HexCrawlerMap) => {
    setRootMap((prev) => updateMapAtPath(prev, path, updater))
  }, [path])

  const replaceMap = useCallback((next: HexCrawlerMap) => {
    setRootMap(cloneMap(next))
    setPath([])
    setSelectedHexId(1)
  }, [])

  const navigateTo = useCallback((nextPath: MapPath) => {
    setPath(nextPath)
    setSelectedHexId(1)
  }, [])

  const setTitle = useCallback(
    (title: string) => {
      updateActiveMap((prev) => ({ ...prev, title }))
    },
    [updateActiveMap],
  )

  const updateHex = useCallback(
    (id: number, patch: Partial<HexCrawlerMap['hexes'][number]>) => {
      updateActiveMap((prev) => ({
        ...prev,
        hexes: prev.hexes.map((hex) => (hex.id === id ? { ...hex, ...patch } : hex)),
      }))
    },
    [updateActiveMap],
  )

  const expandSelectedHex = useCallback(
    (t: (key: string, params?: Record<string, string | number>) => string) => {
      setRootMap((prev) => expandHex(prev, path, selectedHexId, t))
      setPath((prev) => [...prev, selectedHexId])
      setSelectedHexId(1)
    },
    [path, selectedHexId],
  )

  const openSubMap = useCallback((hexId: number) => {
    setPath((prev) => [...prev, hexId])
    setSelectedHexId(1)
  }, [])

  const removeSelectedSubMap = useCallback(() => {
    setRootMap((prev) => removeSubMap(prev, path, selectedHexId))
  }, [path, selectedHexId])

  const setEncounter = useCallback(
    (index: number, value: string) => {
      updateActiveMap((prev) => {
        const encounters = [...prev.encounters]
        encounters[index] = value
        return { ...prev, encounters }
      })
    },
    [updateActiveMap],
  )

  const setRumour = useCallback(
    (index: number, value: string) => {
      updateActiveMap((prev) => {
        const rumours = [...prev.rumours]
        rumours[index] = value
        return { ...prev, rumours }
      })
    },
    [updateActiveMap],
  )

  const updateFaction = useCallback(
    (index: number, patch: Partial<HexCrawlerMap['factions'][number]>) => {
      updateActiveMap((prev) => ({
        ...prev,
        factions: prev.factions.map((faction, i) => (i === index ? { ...faction, ...patch } : faction)),
      }))
    },
    [updateActiveMap],
  )

  const setFactionResource = useCallback(
    (factionIndex: number, resourceIndex: number, value: string) => {
      updateActiveMap((prev) => ({
        ...prev,
        factions: prev.factions.map((faction, i) => {
          if (i !== factionIndex) return faction
          const resources = [...faction.resources]
          resources[resourceIndex] = value
          return { ...faction, resources }
        }),
      }))
    },
    [updateActiveMap],
  )

  const addFactionResource = useCallback(
    (factionIndex: number) => {
      updateActiveMap((prev) => ({
        ...prev,
        factions: prev.factions.map((faction, i) =>
          i === factionIndex ? { ...faction, resources: [...faction.resources, ''] } : faction,
        ),
      }))
    },
    [updateActiveMap],
  )

  const removeFactionResource = useCallback(
    (factionIndex: number, resourceIndex: number) => {
      updateActiveMap((prev) => ({
        ...prev,
        factions: prev.factions.map((faction, i) => {
          if (i !== factionIndex) return faction
          const resources = faction.resources.filter((_, ri) => ri !== resourceIndex)
          return { ...faction, resources: resources.length ? resources : [''] }
        }),
      }))
    },
    [updateActiveMap],
  )

  const setFactionGoal = useCallback(
    (factionIndex: number, goalIndex: number, patch: Partial<FactionGoal>) => {
      updateActiveMap((prev) => ({
        ...prev,
        factions: prev.factions.map((faction, i) => {
          if (i !== factionIndex) return faction
          const goals = faction.goals.map((goal, gi) =>
            gi === goalIndex ? { ...goal, ...patch } : goal,
          )
          return { ...faction, goals }
        }),
      }))
    },
    [updateActiveMap],
  )

  const addFactionGoal = useCallback(
    (factionIndex: number) => {
      updateActiveMap((prev) => ({
        ...prev,
        factions: prev.factions.map((faction, i) =>
          i === factionIndex
            ? { ...faction, goals: [...faction.goals, { text: '', clockSlots: 4 }] }
            : faction,
        ),
      }))
    },
    [updateActiveMap],
  )

  const removeFactionGoal = useCallback(
    (factionIndex: number, goalIndex: number) => {
      updateActiveMap((prev) => ({
        ...prev,
        factions: prev.factions.map((faction, i) => {
          if (i !== factionIndex) return faction
          const goals = faction.goals.filter((_, gi) => gi !== goalIndex)
          return { ...faction, goals: goals.length ? goals : [{ text: '', clockSlots: 4 }] }
        }),
      }))
    },
    [updateActiveMap],
  )

  return {
    rootMap,
    map,
    path,
    breadcrumbs,
    selectedHexId,
    setSelectedHexId,
    message,
    showMessage,
    replaceMap,
    navigateTo,
    setTitle,
    updateHex,
    expandSelectedHex,
    openSubMap,
    removeSelectedSubMap,
    setEncounter,
    setRumour,
    updateFaction,
    setFactionResource,
    addFactionResource,
    removeFactionResource,
    setFactionGoal,
    addFactionGoal,
    removeFactionGoal,
  }
}
