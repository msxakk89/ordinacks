
;; >> ordinacks <<
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(define-non-fungible-token ordinacks uint)

;; >> constants <<
(define-constant MINT_PRICE u25000000)
(define-constant CONTRACT_OWNER tx-sender)
(define-constant url-root "https://ordinals.com/inscription/")
(define-constant url-appendix "i0")

;; >> error codes constants <<
(define-constant ERR_CANNOT_UNWRAP_TX_ID (err u100))
(define-constant ERR_OWNER_ONLY (err u101))
(define-constant ERR_NOT_ORDINACK_OWNER (err u102))
(define-constant ERR_TOKEN_DOES_NOT_EXIST (err u103))


;; >> variables <<
(define-data-var last-token-id uint u0)

;; >> maps <<
;; ordinacksdb mapping scheme: ordinack id -> ordinal data tuple
;; - btc_tx_id: tx if for the ordinal genesis transaction on btc chain
;; - btc_address: address at which ordinal existed at the time of ordinack minting 
(define-map ordinacksdb uint {  btc_tx_id: (string-ascii 100) ,
                                btc_address: (string-ascii 100)})

(map-set ordinacksdb u0 {btc_tx_id: "b2316458f3c38cd55f276262aa87b286a63767b4d4ae10f11759e53632dd6029",
                        btc_address: "bc1pp2w42awvngedvngchp4w9gfnj2efnusp582zq0n324dd5nww9pxqf8xck6"})

;; >> private functions <<
;; get_id: obtain tx id of ordinal inscription for given ordinack id
(define-read-only (get_tx_id (id uint)) (get btc_tx_id (map-get? ordinacksdb id)))

;; >> read-only functions <<
;; get-last-token-id: get the id of the last minted ordinack
(define-read-only (get-last-token-id) 
  (ok (var-get last-token-id))
)

;; get-token-uri: return uri from ordinals.com server corresponding to the minted ordinack 
(define-read-only (get-token-uri (id uint)) 
  (ok (some 
      (concat (concat url-root
                      (unwrap! (get_tx_id id) ERR_CANNOT_UNWRAP_TX_ID)) 
                      url-appendix)))
)

(define-read-only (verify) 
  (secp256k1-verify 
  0x313233
  0x4a342f31302b4c64622f362f4b5a76676c5675344944736256316f444861367367736d72574c54474371566250736369686d686b4d456447476d514f486534334e477530722b61344e334c32534d46337a757859794f343d
  0x626331716b6b33376c70376370333736656c33703774306b63666a637371787934747a35716572776a75)
)

(define-public (mint)
  (let 
    (
      (id (+ (var-get last-token-id) u1))
    )
    (var-set last-token-id id)
    (try! (stx-transfer? MINT_PRICE tx-sender CONTRACT_OWNER))
    ;;(try! (nft-mint? alex-token (var-get last-token-id) tx-sender))
    (ok id)
  )
)

;; continue HERE
(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? ordinacks id))
)

(define-public (transfer (id uint) (sender principal) (receiver principal))
  (begin
    (asserts! (<= id (var-get last-token-id)) ERR_TOKEN_DOES_NOT_EXIST)
    ;;(asserts! (is-eq (nft-get-owner? alex-token id) (some tx-sender)) ERR_NOT_TOKEN_OWNER)
    ;;(asserts! (is-eq (nft-get-owner? alex-token id) (some sender)) ERR_NOT_TOKEN_OWNER)
    ;;(nft-transfer? alex-token id sender receiver)
    (ok true)
))





