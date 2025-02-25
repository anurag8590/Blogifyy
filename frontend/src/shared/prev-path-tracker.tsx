import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";

interface PathNode {
  path: string;
  prev: string | null;
  next: string | null;
}

export function PathHistoryTracker() {
  const location = useLocation();
  const initialMount = useRef(true);
  const lastNavigatedPath = useRef<string | null>(null);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
      const initialNode: PathNode = {
        path: location.pathname,
        prev: null,
        next: null
      };
      sessionStorage.setItem("pathHistory", JSON.stringify({
        [location.pathname]: initialNode
      }));
      sessionStorage.setItem("currentPath", location.pathname);
      lastNavigatedPath.current = location.pathname;
      return;
    }

    if (lastNavigatedPath.current !== location.pathname) {
      const currentPath = location.pathname;
      const previousPath = lastNavigatedPath.current;
      
      const historyString = sessionStorage.getItem("pathHistory");
      const pathHistory: Record<string, PathNode> = historyString ? JSON.parse(historyString) : {};
      
      const existingNode = pathHistory[currentPath];
      if (existingNode) {
        sessionStorage.setItem("currentPath", currentPath);
        lastNavigatedPath.current = currentPath;
        return;
      }

      pathHistory[currentPath] = {
        path: currentPath,
        prev: previousPath,
        next: null
      };
      
      if (previousPath && pathHistory[previousPath]) {
        pathHistory[previousPath].next = currentPath;
      }
      
      sessionStorage.setItem("pathHistory", JSON.stringify(pathHistory));
      sessionStorage.setItem("currentPath", currentPath);
      lastNavigatedPath.current = currentPath;
    }
  }, [location.pathname]);

  return null;
}

export function getPreviousPath(): string | null {
  const historyString = sessionStorage.getItem("pathHistory");
  const currentPath = sessionStorage.getItem("currentPath");
  
  if (!historyString || !currentPath) {
    return null;
  }

  const pathHistory: Record<string, PathNode> = JSON.parse(historyString);
  const currentNode = pathHistory[currentPath];
  
  return currentNode?.prev || null;
}

export function navigateToHistoryPath(targetPath: string): PathNode | null {
  const historyString = sessionStorage.getItem("pathHistory");
  if (!historyString) return null;
  
  const pathHistory: Record<string, PathNode> = JSON.parse(historyString);
  return pathHistory[targetPath] || null;
}

export function getPathChain(): string[] {
  const historyString = sessionStorage.getItem("pathHistory");
  const currentPath = sessionStorage.getItem("currentPath");
  
  if (!historyString || !currentPath) {
    return [];
  }

  const pathHistory: Record<string, PathNode> = JSON.parse(historyString);
  const chain: string[] = [];
  let current = pathHistory[currentPath];
  
  chain.push(currentPath);
  
  while (current && current.prev) {
    chain.unshift(current.prev);
    current = pathHistory[current.prev];
  }
  
  return chain;
}