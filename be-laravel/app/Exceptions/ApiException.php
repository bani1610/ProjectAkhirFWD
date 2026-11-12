<?php

namespace App\Exceptions;

use App\Http\Responses\ApiResponse;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Exception yang sudah dipetakan ke bentuk respons API standar.
 *
 * Lempar exception ini dari controller atau service alih-alih menyusun
 * respons error manual, supaya kode dan bentuknya konsisten.
 */
class ApiException extends Exception
{
    /**
     * @param  array<string, array<int, string>>  $errors
     */
    public function __construct(
        string $message,
        protected int $status = 400,
        protected string $errorCode = 'API_ERROR',
        protected array $errors = [],
        protected array $meta = [],
    ) {
        parent::__construct($message);
    }

    public function render(Request $request): JsonResponse
    {
        return ApiResponse::error(
            $this->getMessage(),
            $this->status,
            $this->errorCode,
            $this->errors,
            $this->meta,
        );
    }

    public static function unauthorized(string $message = 'Sesi tidak valid atau token kedaluwarsa.'): self
    {
        return new self($message, 401, 'UNAUTHENTICATED');
    }

    public static function forbidden(string $message = 'Anda tidak memiliki akses ke resource ini.'): self
    {
        return new self($message, 403, 'FORBIDDEN');
    }

    public static function notFound(string $message = 'Resource tidak ditemukan.'): self
    {
        return new self($message, 404, 'NOT_FOUND');
    }

    public static function conflict(string $message, string $code = 'CONFLICT'): self
    {
        return new self($message, 409, $code);
    }

    public static function unprocessable(string $message, string $code = 'UNPROCESSABLE', array $errors = []): self
    {
        return new self($message, 422, $code, $errors);
    }
}
