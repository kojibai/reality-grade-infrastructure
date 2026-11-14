# Build with Receiz v128

Install the coordinated public packages at exact version 128.0.0:

```sh
npm install @receiz/sdk@128.0.0 @receiz/mcp-server@128.0.0 @receiz/ai-skills@128.0.0
```

Use the published package's own license and supported entry points. This disclosure does not redistribute the private application runtime.

- [Offline file sealing and local KaiSigil proving](guides/offline-sealing.md): Node/browser setup, one-time file-signer enrollment, private local custody, installed canonical proof resources, saved-byte verification and MCP tools.
- [Durable local subject runtime](guides/local-subject-runtime.md): admitted identity, enclosing sealed source, exact historical protocol, causal KaiSigil transitions, restart, portable export and sealed import.
- [Historical HTTP boundaries](guides/historical-http.md): explicit compatibility-host requirements; local sealing and local subject execution require no historical HTTP host.

The guides are the selected public SDK128 documentation, copied without changing its execution requirements. Missing file-signer enrollment fails explicitly. Local KaiSigil generation does not require that enrollment. Cloud AI inference still needs connectivity; local tools and local inference can run locally.

## Strict MCP TypeScript declarations

The published MCP128 declarations contain three inferred imports of `@/packages/receiz-sdk/dist/v125KaiAuthority.js`. Strict consumers checking all package declarations need the exact installed-SDK mapping below. This documents an existing package limitation; it does not disable library checking or modify published package bytes.

```json
{
  "compilerOptions": {
    "skipLibCheck": false,
    "paths": {
      "@/packages/receiz-sdk/dist/v125KaiAuthority.js": ["./node_modules/@receiz/sdk/dist/v125KaiAuthority.d.ts"]
    }
  }
}
```

The app's signed-release attestation and this repository's disclosure attestation are separate artifacts. A verified disclosure inventory does not certify an integration's permissions, payment completion, ownership transitions or private runtime.
