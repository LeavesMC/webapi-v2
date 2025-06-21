export interface BuildData {
    projectId: string;
    buildId: number;
    timestamp: string;
    experimental: boolean;
    jarName: string;
    sha256: string;
    versionId: number;
    tag: string;
    changeIds: number[];
    downloadSources: string[];
}

export interface DownloadData {
    name: string;
    jarName: string;
    sha256: string;
    url: string;
}

export interface ChangeData {
    commit: string;
    summary: string;
    message: string;
}