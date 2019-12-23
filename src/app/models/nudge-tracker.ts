export class NudgeTracker {
    id: number;
    name: string;
    palettes_id: string;
    meta: NudgeMetadata;
    user: NudgeUserData;
}

export class NudgeMetadata {
    slug: string;
    tags: string[];
    log_format: string;
    resource: string;
    //resources: string[];
    config: string;
    deduplicated: boolean;
}

export class NudgeUserData {
    id: number;
    settings: NudgeUserDataSettings;
    logs: NudgeUserDataLog[];
}

export class NudgeUserDataSettings {
    enabled: boolean;
    rank: number;
}

export class NudgeUserDataLog {
    id: number;
    users_id: number;
    response: string;
    notes: string;
    user_time: string;
    source: string;
    meta: NudgeMetadata;
}