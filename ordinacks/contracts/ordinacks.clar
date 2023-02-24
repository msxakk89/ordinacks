
;; ordinacks
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)
(define-non-fungible-token ordinacks uint)
;; constants
(define-constant MINT_PRICE u25000000)
(define-constant CONTRACT_OWNER tx-sender)
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_NOT_ORDINACK_OWNER (err u101))
(define-constant ERR_TOKEN_DOES_NOT_EXIST (err u102))

(define-data-var last-token-id uint u0)

;; WRITE get-last-token-id FUNCTION HERE
(define-read-only (get-last-token-id) 
  (ok (var-get last-token-id))
)

(define-read-only (get-token-uri (id uint)) 
  (ok none)
)

(define-read-only (get-owner (id uint))
  (ok (nft-get-owner? ordinacks id))
)

;; WRITE transfer FUNCTION HERE
(define-public (transfer (id uint) (sender principal) (receiver principal))
  (begin
    (asserts! (<= id (var-get last-token-id)) ERR_TOKEN_DOES_NOT_EXIST)
    ;;(asserts! (is-eq (nft-get-owner? alex-token id) (some tx-sender)) ERR_NOT_TOKEN_OWNER)
    ;;(asserts! (is-eq (nft-get-owner? alex-token id) (some sender)) ERR_NOT_TOKEN_OWNER)
    ;;(nft-transfer? alex-token id sender receiver)
    (ok true)
))

(define-public (mint)
  (let 
    (
      (id (+ (var-get last-token-id) u1))
    )
    ;; COMPLETE THIS FUNCTION HERE
    (var-set last-token-id id)
    (try! (stx-transfer? MINT_PRICE tx-sender CONTRACT_OWNER))
    ;;(try! (nft-mint? alex-token (var-get last-token-id) tx-sender))
    (ok id)
  )
)

;; WRITE mint-five FUNCTION HERE
(define-public (mint-five) 
  (begin 
  (try! (fire))
  (try! (fire))
  (try! (fire))
  (try! (fire))
  (try! (fire))
  (ok (var-get last-token-id))
  ))

(define-private (fire) 
   (let 
    (
      (id (+ (var-get last-token-id) u1))
    )
    ;; COMPLETE THIS FUNCTION HERE
    (var-set last-token-id id)
    (try! (stx-transfer? MINT_PRICE tx-sender CONTRACT_OWNER))
    ;;(try! (nft-mint? alex-token (var-get last-token-id) tx-sender))
    (ok true)
  )
)