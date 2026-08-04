$ErrorActionPreference = 'Stop'
$base = 'http://127.0.0.1:3100/api/v1'
$email = 'verify-whatsapp-' + [guid]::NewGuid().ToString('N') + '@example.com'
$password = 'Password123!'

function Invoke-JsonRequest {
    param(
        [string]$Uri,
        [string]$Method = 'GET',
        [hashtable]$Headers = @{},
        [string]$Body
    )

    $params = @{
        Uri = $Uri
        Method = $Method
        Headers = $Headers
    }

    if ($PSBoundParameters.ContainsKey('Body')) {
        $params.Body = $Body
    }

    try {
        $response = Invoke-RestMethod @params
        return $response
    }
    catch {
        if ($_.Exception.Response) {
            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = New-Object System.IO.StreamReader($stream)
                $text = $reader.ReadToEnd()
                $reader.Dispose()
                return $text
            }
        }

        return $_.Exception.Message
    }
}

$registerBody = @{
    firstName = 'Verify'
    lastName = 'User'
    email = $email
    password = $password
    confirmPassword = $password
} | ConvertTo-Json -Compress

$register = Invoke-JsonRequest -Uri "$base/auth/register" -Method 'POST' -Headers @{ 'Content-Type' = 'application/json' } -Body $registerBody
Write-Output "REGISTER=$($register | ConvertTo-Json -Depth 20)"

$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json -Compress

$login = Invoke-JsonRequest -Uri "$base/auth/login" -Method 'POST' -Headers @{ 'Content-Type' = 'application/json' } -Body $loginBody
Write-Output "LOGIN=$($login | ConvertTo-Json -Depth 20)"

if ($login.success -ne $true -or -not $login.data.accessToken) {
    throw 'Login did not yield accessToken'
}

$token = $login.data.accessToken
$headers = @{ Authorization = "Bearer $token" }

$orgBody = @{
    name = 'WhatsApp Verification Org'
    description = 'Runtime verification org'
} | ConvertTo-Json -Compress

$org = Invoke-JsonRequest -Uri "$base/organizations" -Method 'POST' -Headers ($headers + @{ 'Content-Type' = 'application/json' }) -Body $orgBody
Write-Output "ORG=$($org | ConvertTo-Json -Depth 20)"

$organizationId = $org.data.id
if (-not $organizationId) {
    throw 'Organization creation did not return id'
}

$sessionKey = 'verify-session-' + [guid]::NewGuid().ToString('N')
$connectBody = @{
    organizationId = $organizationId
    sessionKey = $sessionKey
} | ConvertTo-Json -Compress

$connect = Invoke-JsonRequest -Uri "$base/platforms/whatsapp/connect" -Method 'POST' -Headers ($headers + @{ 'Content-Type' = 'application/json' }) -Body $connectBody
Write-Output "CONNECT=$($connect | ConvertTo-Json -Depth 20)"

Start-Sleep -Seconds 2

$status = Invoke-JsonRequest -Uri "$base/platforms/whatsapp/status?organizationId=$organizationId&sessionKey=$sessionKey" -Method 'GET' -Headers $headers
Write-Output "STATUS=$($status | ConvertTo-Json -Depth 20)"

$qr = Invoke-JsonRequest -Uri "$base/platforms/whatsapp/qr?organizationId=$organizationId&sessionKey=$sessionKey" -Method 'GET' -Headers $headers
Write-Output "QR=$($qr | ConvertTo-Json -Depth 20)"
