export async function saveToIndexedDB(key: string, data: any): Promise<void> {
  try {
    const request = indexedDB.open('chat-storage', 1);

    await new Promise<void>((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['chat-data'], 'readwrite');
        const store = transaction.objectStore('chat-data');
        const putRequest = store.put({ key, value: JSON.stringify(data) });

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('chat-data')) {
          db.createObjectStore('chat-data', { keyPath: 'key' });
        }
      };
    });
  } catch (error) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export async function loadFromIndexedDB(key: string): Promise<any> {
  try {
    const request = indexedDB.open('chat-storage', 1);

    return await new Promise((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['chat-data'], 'readonly');
        const store = transaction.objectStore('chat-data');
        const getRequest = store.get(key);

        getRequest.onsuccess = () => {
          const result = getRequest.result?.value;
          resolve(result ? JSON.parse(result) : null);
        };
        getRequest.onerror = () => reject(getRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('chat-data')) {
          db.createObjectStore('chat-data', { keyPath: 'key' });
        }
      };
    });
  } catch (error) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }
}

export async function clearFromIndexedDB(key: string): Promise<void> {
  try {
    const request = indexedDB.open('chat-storage', 1);

    await new Promise<void>((resolve, reject) => {
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result;
        const transaction = db.transaction(['chat-data'], 'readwrite');
        const store = transaction.objectStore('chat-data');
        const deleteRequest = store.delete(key);

        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('chat-data')) {
          db.createObjectStore('chat-data', { keyPath: 'key' });
        }
      };
    });
  } catch (error) {
    localStorage.removeItem(key);
  }
}