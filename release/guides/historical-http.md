# Historical HTTP compatibility

The current SDK preserves published v106 Connect method signatures. Preservation
does not mean the current Receiz server implements their historical routes.
`RECEIZ_HTTP_OPERATION_SUPPORT` records the execution mode, exact current route
files, missing routes, and historical source evidence for these methods.
Route source evidence is not production qualification or proof authority.

The current JSON SDK adapter family has 86 MCP bindings: 17 current HTTP
compositions and 69 historical HTTP contracts. Current compositions include eight
Twin operations, three webhook endpoint operations, commerce card-session
creation, wallet read/transfer, delegated checkout creation/status, and public
embedded merchant checkout. Two additional financial artifact adapters preserve
exact sealed note-download bytes and canonical bearer-claim custody privately;
they are separate from JSON-only dispatch. The older `media.upload`,
`media.transform`, and `proof.query` methods also require historical transport.

Historical categories are customers, merchants, commerce beyond card checkout,
DNS reservation/verification, event subscriptions, generic jobs, tenant roles,
audit exports, risk scoring, compliance exports, store portability, search,
notifications, and release pinning. Credential configuration alone does not make
these routes available. Modern verified-domain operations remain separate from
historical DNS operations and keep their own proof admission.

Default calls fail with `RECEIZ_HISTORICAL_CONNECT_HOST_REQUIRED` before HTTP.
To use a host that actually implements the historical contract, explicitly select
both that host and the compatibility transport:

```ts
const client = createReceizClient({
  baseUrl: "https://your-compatibility-host.example",
  legacyConnectTransport: "http",
  accessToken,
});
```

This configuration declares the caller's intended transport; it does not verify
that the external host implements the contract. The default Receiz origin cannot
be selected as a historical compatibility host. A custom fetch implementation
alone does not enable compatibility. MCP exposes the same execution modes and
requires explicit host configuration before producing a mutation preview.

`commerce.oneClickCheckout` creates a card checkout session; session creation is
not completed payment. It never treats a wallet read as settlement. When positive
wallet funding is proposed, it returns `wallet_settlement_execution_required`,
reports zero wallet funds applied, and performs no card request. Explicit
`walletFirst: false` creates a checkout session for the full amount.

Use the current settlement, admitted execution, sealed-source, and verified
domain APIs with their actual proof inputs. Historical JSON inputs cannot be
silently substituted for admitted owner, recipient, proof-head, or settlement
authority. Offline proof creation and the shipped local subject runtime do not
require this historical HTTP transport.
