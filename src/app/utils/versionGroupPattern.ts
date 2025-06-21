export type VersionGroupPatternLike = { pattern: string, project?: string }

export class VersionGroupPattern {
    constructor(public pattern: string, public project?: string) {
    }

    static from(obj: VersionGroupPatternLike) {
        return new VersionGroupPattern(obj.pattern, obj.project);
    }

    static fromArray(arr: VersionGroupPatternLike[]): VersionGroupPattern[] {
        return arr.map(VersionGroupPattern.from);
    }

    protected static smallerThan([patMajor, patMinor, patMatch]: [number, number, number], [major, minor, patch]: [number, number, number]) {
        return patMajor < major || patMajor == major && (patMinor < minor || patMinor == minor && patMatch < patch);
    }

    protected static equals([patMajor, patMinor, patMatch]: [number, number, number], [major, minor, patch]: [number, number, number]) {
        return patMajor == major && patMinor == minor && patMatch == patch;
    }

    validate(project: string, [major, minor, patch]: [number, number, number]) {
        if (this.project != undefined && this.project != project) return false;
        if (this.pattern == "*") return true;
        const [patMajor, patMinor, patPatch] = this.getGroup();
        if (this.pattern.startsWith("~")) {
            return patMajor == major && VersionGroupPattern.smallerThan([patMajor, patMinor, patPatch], [major, minor, patch]);
        }
        if (this.pattern.startsWith("^")) {
            return patMajor == major && patMinor == minor && patPatch <= patch;
        }
        return VersionGroupPattern.equals([patMajor, patMinor, patPatch], [major, minor, patch]);
    }

    getGroupName() {
        if (this.pattern == "*") {
            return "0";
        } else if (this.pattern.startsWith("~") || this.pattern.startsWith("^")) {
            return this.pattern.slice(1);
        }
        return this.pattern;
    }

    getGroup(): [number, number, number] {
        let [major, minor, patch] = this.getGroupName().split(".").map(str => parseInt(str));
        minor = minor || 0;
        patch = patch || 0;
        return [major, minor, patch];
    }
}