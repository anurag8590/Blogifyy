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
  // Fix the TypeScript error by setting the correct type
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

    // Only proceed if this is an actual navigation
    if (lastNavigatedPath.current !== location.pathname) {
      const currentPath = location.pathname;
      const previousPath = lastNavigatedPath.current;
      
      // Get existing history
      const historyString = sessionStorage.getItem("pathHistory");
      const pathHistory: Record<string, PathNode> = historyString ? JSON.parse(historyString) : {};
      
      // Check if we're navigating backwards
      const existingNode = pathHistory[currentPath];
      if (existingNode) {
        // We're navigating to an existing path
        // Don't create new connections, just update the current path
        sessionStorage.setItem("currentPath", currentPath);
        lastNavigatedPath.current = currentPath;
        return;
      }

      // Create new node for forward navigation
      pathHistory[currentPath] = {
        path: currentPath,
        prev: previousPath,
        next: null
      };
      
      // Update previous node's next pointer
      if (previousPath && pathHistory[previousPath]) {
        pathHistory[previousPath].next = currentPath;
      }
      
      // Store updated history
      sessionStorage.setItem("pathHistory", JSON.stringify(pathHistory));
      sessionStorage.setItem("currentPath", currentPath);
      lastNavigatedPath.current = currentPath;
    }
  }, [location.pathname]);

  return null;
}

// Enhanced utility function to get previous path
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

// Enhanced navigation function
export function navigateToHistoryPath(targetPath: string): PathNode | null {
  const historyString = sessionStorage.getItem("pathHistory");
  if (!historyString) return null;
  
  const pathHistory: Record<string, PathNode> = JSON.parse(historyString);
  return pathHistory[targetPath] || null;
}

// Utility function to get complete path chain
export function getPathChain(): string[] {
  const historyString = sessionStorage.getItem("pathHistory");
  const currentPath = sessionStorage.getItem("currentPath");
  
  if (!historyString || !currentPath) {
    return [];
  }

  const pathHistory: Record<string, PathNode> = JSON.parse(historyString);
  const chain: string[] = [];
  let current = pathHistory[currentPath];
  
  // Add current path
  chain.push(currentPath);
  
  // Add previous paths
  while (current && current.prev) {
    chain.unshift(current.prev);
    current = pathHistory[current.prev];
  }
  
  return chain;
}