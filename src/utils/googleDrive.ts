import { Santri } from '../types';

/**
 * Fetch files from Google Drive v3 API. Only displays files that are not trashed.
 */
export const fetchDriveFiles = async (
  accessToken: string,
  folderId?: string
): Promise<any[]> => {
  let qParts = ['trashed = false'];
  if (folderId) {
    qParts.push(`'${folderId}' in parents`);
  }
  const qStr = encodeURIComponent(qParts.join(' and '));
  
  const response = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${qStr}&fields=files(id,name,mimeType,webViewLink,iconLink,size,createdTime)&orderBy=folder,createdTime%20desc`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gagal mengambil daftar berkas dari Google Drive.');
  }

  const data = await response.json();
  return data.files || [];
};

/**
 * Creates a dedicated Folder in Google Drive.
 */
export const createDriveFolder = async (
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<string> => {
  const metadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder'
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gagal membuat folder di Google Drive.');
  }

  const data = await response.json();
  return data.id;
};

/**
 * Uploads any user file to Google Drive under an optional folderId.
 * Standard multipart upload used for high performance and metadata control.
 */
export const uploadFileToDrive = async (
  accessToken: string,
  file: File,
  folderId?: string
): Promise<any> => {
  const metadata: any = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream'
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = 'MiftahulUlumBoundarySeparator';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Read file as base64 representation
  const reader = new FileReader();
  const base64Promise = new Promise<string>((resolve, reject) => {
    reader.onload = () => {
      const result = reader.result as string;
      const commaIdx = result.indexOf(',');
      if (commaIdx !== -1) {
        resolve(result.substring(commaIdx + 1));
      } else {
        resolve(result);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });

  const base64Content = await base64Promise;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${metadata.mimeType}\r\n` +
    'Content-Transfer-Encoding: base64\r\n\r\n' +
    base64Content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    }
  );

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Format atau ukuran berkas tidak didukung Google Drive.');
  }

  return await response.json();
};

/**
 * Delete a specific file or folder in Google Drive.
 */
export const deleteDriveFile = async (
  accessToken: string,
  fileId: string
): Promise<void> => {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || 'Gagal menghapus berkas terpilih di Google Drive.');
  }
};
