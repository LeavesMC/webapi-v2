create table general
(
    version integer not null
);

insert into general
values (1);

create table projects
(
    id   text primary key,
    name text not null,
    repo text not null
);

create table version_groups
(
    id      serial primary key,
    project text references projects (id) not null,
    name    text                          not null
);

create table versions
(
    id            serial primary key,
    name          text                               not null,
    project       text references projects (id)      not null,
    version_group int references version_groups (id) not null
);

create table builds
(
    id               serial primary key,
    project          text references projects (id) not null,
    build_id         int                           not null,
    time             timestamptz                   not null,
    experimental     bool                          not null,
    jar_name         text                          not null,
    sha256           text                          not null,
    version          int references versions (id)  not null,
    tag              text                          not null,
    changes          int[]                         not null,
    download_sources text[]                        not null
);

create index idx_builds_version_build_id on builds (version, build_id desc);
create index idx_builds_changes_gin on builds using gin (changes);

create table changes
(
    id      serial primary key,
    project text references projects (id) not null,
    commit  text                          not null,
    summary text                          not null,
    message text                          not null
);

create index idx_changes_commit_prefix on changes (commit text_pattern_ops);

create table downloads
(
    id              serial primary key,
    project         text references projects (id) not null,
    tag             text                          not null,
    download_source text                          not null,
    url             text                          not null
);