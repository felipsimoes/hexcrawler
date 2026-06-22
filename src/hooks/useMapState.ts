import { useCallback, useEffect, useRef, useState } from 'react'
import { OAKWOOD_TEMPLATE } from '../data/oakwood-template'
import { cloneMap } from '../lib/validation'
import { loadFromLocalStorage, saveToLocalStorage } from '../lib/persistence'
import type { FactionGoal, HexCrawlerMap } from '../types/map'

function getInitialMap(): HexCrawlerMap {
  return loadFromLocalStorage() ?? cloneMap(OAKWOOD_TEMPLATE)
}

export function useMapState() {
  const [map, setMap] = useState<HexCrawlerMap>(getInitialMap)
  const [selectedHexId, setSelectedHexId] = useState(1)
  const [message, setMessage] = useState<string | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showMessage = useCallback((text: string) => {
    setMessage(text)
    setTimeout(() => setMessage(null), 4000)
  }, [])

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => saveToLocalStorage(map), 500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [map])

  const replaceMap = useCallback((next: HexCrawlerMap) => {
    setMap(cloneMap(next))
    setSelectedHexId(1)
  }, [])

  const setTitle = useCallback((title: string) => {
    setMap((prev) => ({ ...prev, title }))
  }, [])

  const updateHex = useCallback(
    (id: number, patch: Partial<HexCrawlerMap['hexes'][number]>) => {
      setMap((prev) => ({
        ...prev,
        hexes: prev.hexes.map((hex) => (hex.id === id ? { ...hex, ...patch } : hex)),
      }))
    },
    [],
  )

  const setEncounter = useCallback((index: number, value: string) => {
    setMap((prev) => {
      const encounters = [...prev.encounters]
      encounters[index] = value
      return { ...prev, encounters }
    })
  }, [])

  const setRumour = useCallback((index: number, value: string) => {
    setMap((prev) => {
      const rumours = [...prev.rumours]
      rumours[index] = value
      return { ...prev, rumours }
    })
  }, [])

  const updateFaction = useCallback((index: number, patch: Partial<HexCrawlerMap['factions'][number]>) => {
    setMap((prev) => ({
      ...prev,
      factions: prev.factions.map((faction, i) => (i === index ? { ...faction, ...patch } : faction)),
    }))
  }, [])

  const setFactionResource = useCallback((factionIndex: number, resourceIndex: number, value: string) => {
    setMap((prev) => ({
      ...prev,
      factions: prev.factions.map((faction, i) => {
        if (i !== factionIndex) return faction
        const resources = [...faction.resources]
        resources[resourceIndex] = value
        return { ...faction, resources }
      }),
    }))
  }, [])

  const addFactionResource = useCallback((factionIndex: number) => {
    setMap((prev) => ({
      ...prev,
      factions: prev.factions.map((faction, i) =>
        i === factionIndex ? { ...faction, resources: [...faction.resources, ''] } : faction,
      ),
    }))
  }, [])

  const removeFactionResource = useCallback((factionIndex: number, resourceIndex: number) => {
    setMap((prev) => ({
      ...prev,
      factions: prev.factions.map((faction, i) => {
        if (i !== factionIndex) return faction
        const resources = faction.resources.filter((_, ri) => ri !== resourceIndex)
        return { ...faction, resources: resources.length ? resources : [''] }
      }),
    }))
  }, [])

  const setFactionGoal = useCallback(
    (factionIndex: number, goalIndex: number, patch: Partial<FactionGoal>) => {
      setMap((prev) => ({
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
    [],
  )

  const addFactionGoal = useCallback((factionIndex: number) => {
    setMap((prev) => ({
      ...prev,
      factions: prev.factions.map((faction, i) =>
        i === factionIndex
          ? { ...faction, goals: [...faction.goals, { text: '', clockSlots: 4 }] }
          : faction,
      ),
    }))
  }, [])

  const removeFactionGoal = useCallback((factionIndex: number, goalIndex: number) => {
    setMap((prev) => ({
      ...prev,
      factions: prev.factions.map((faction, i) => {
        if (i !== factionIndex) return faction
        const goals = faction.goals.filter((_, gi) => gi !== goalIndex)
        return { ...faction, goals: goals.length ? goals : [{ text: '', clockSlots: 4 }] }
      }),
    }))
  }, [])

  return {
    map,
    selectedHexId,
    setSelectedHexId,
    message,
    showMessage,
    replaceMap,
    setTitle,
    updateHex,
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
