use mediheaven::code_client::CodeClient;
use mediheaven::CodeRequest;

pub mod mediheaven {
    tonic::include_proto!("mediheaven");
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>>{
    let mut client = CodeClient::connect("http://[::1]:50051").await?;

    let request = tonic::Request::new(CodeRequest {
        account_type: String::from("admin"),
        signature: String::from("test")
    });

    let response = client.get_code(request).await?;

    println!("response: {:?}", response);
    
    Ok(())
}